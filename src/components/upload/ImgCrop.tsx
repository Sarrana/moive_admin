import React, { useState, useCallback, useMemo, useRef, forwardRef, memo, Dispatch, SetStateAction, MutableRefObject, ForwardedRef, useImperativeHandle } from 'react';
import AntModal from 'antd/es/modal';
import AntUpload from 'antd/es/upload';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import Cropper, { Area, CropperProps, Point, Size } from 'react-easy-crop';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import './img-crop.less';

export const PREFIX = 'img-crop';

export const INIT_ZOOM = 1;
export const ZOOM_STEP = 0.1;
export const INIT_ROTATE = 0;
export const ROTATE_STEP = 1;
export const MIN_ROTATE = -180;
export const MAX_ROTATE = 180;

interface ImgCropProps {
    aspect?: number;
    shape?: 'rect' | 'round';
    grid?: boolean;
    quality?: number;
    fillColor?: string;

    zoom?: boolean;
    rotate?: boolean;
    minZoom?: number;
    maxZoom?: number;

    modalTitle?: string;
    modalWidth?: number | string;
    modalOk?: string;
    modalCancel?: string;
    modalMaskTransitionName?: string;
    modalTransitionName?: string;
    onModalOk?: (file: void | boolean | string | Blob | File) => void;
    onModalCancel?: () => void;

    beforeCrop?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
    onUploadFail?: (err: Error) => void;
    cropperProps?: Partial<CropperProps>;
    // @ts-ignore
    children: JSX.Element;
}

const ImgCrop1 = forwardRef<Cropper, ImgCropProps>((props, ref) => {
    const {
        aspect = 1,
        shape = 'rect',
        grid = false,
        quality = 0.4,
        fillColor = 'white',

        zoom = true,
        rotate = false,
        minZoom = 1,
        maxZoom = 3,

        modalTitle,
        modalWidth,
        modalOk,
        modalCancel,
        modalMaskTransitionName,
        modalTransitionName,
        onModalOk,
        onModalCancel,

        beforeCrop,
        onUploadFail,
        cropperProps,
        children
    } = props;

    const cb = useRef<
        Pick<ImgCropProps, 'onModalOk' | 'onModalCancel' | 'beforeCrop' | 'onUploadFail'>
    >({});
    cb.current.onModalOk = onModalOk;
    cb.current.onModalCancel = onModalCancel;
    cb.current.beforeCrop = beforeCrop;
    cb.current.onUploadFail = onUploadFail;

    /**
     * Upload
     */
    const [image, setImage] = useState('');
    const fileRef = useRef<RcFile>();
    const beforeUploadRef = useRef<UploadProps['beforeUpload']>();
    const resolveRef = useRef<ImgCropProps['onModalOk']>();
    const rejectRef = useRef<(err: Error) => void>();

    const uploadComponent = useMemo(() => {
        const upload = Array.isArray(children) ? children[0] : children;
        const { beforeUpload, accept, ...restUploadProps } = upload.props;
        beforeUploadRef.current = beforeUpload;

        return {
            ...upload,
            props: {
                ...restUploadProps,
                accept: accept || 'image/*',
                beforeUpload: (file, fileList) => {
                    return new Promise(async (resolve, reject) => {
                        if (cb.current.beforeCrop) {
                            const shouldCrop = await cb.current.beforeCrop(file, fileList);
                            // @ts-ignore
                            if (!shouldCrop) return reject();
                        }

                        fileRef.current = file;
                        resolveRef.current = (newFile) => {
                            cb.current.onModalOk?.(newFile);
                            resolve(newFile);
                        };
                        rejectRef.current = (uploadErr) => {
                            cb.current.onUploadFail?.(uploadErr);
                            reject();
                        };

                        const reader = new FileReader();
                        reader.addEventListener('load', () => {
                            if (typeof reader.result === 'string') {
                                setImage(reader.result);
                            }
                        });
                        reader.readAsDataURL(file);
                    });
                }
            }
        };
    }, [children]);

    /**
     * Crop
     */
    const easyCropRef = useRef<EasyCropHandle>({} as EasyCropHandle);

    /**
     * Modal
     */
    const modalProps = useMemo(() => {
        const obj = {
            width: modalWidth,
            okText: modalOk,
            cancelText: modalCancel,
            maskTransitionName: modalMaskTransitionName,
            transitionName: modalTransitionName
        };
        Object.keys(obj).forEach((key) => {
            if (!obj[key]) delete obj[key];
        });
        return obj;
    }, [modalCancel, modalMaskTransitionName, modalOk, modalTransitionName, modalWidth]);

    const onClose = () => {
        setImage('');
        easyCropRef.current.setZoomVal(INIT_ZOOM);
        easyCropRef.current.setRotateVal(INIT_ROTATE);
    };

    const onCancel = useCallback(() => {
        cb.current.onModalCancel?.();
        onClose();
    }, []);

    const onOk = useCallback(async () => {
        onClose();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // @ts-ignore
        const imgSource = document.querySelector(`.${PREFIX}-media`) as CanvasImageSource & {
            naturalWidth: number;
            naturalHeight: number;
        };
        const {
            width: cropWidth,
            height: cropHeight,
            x: cropX,
            y: cropY
        } = easyCropRef.current.cropPixelsRef.current;

        if (rotate && easyCropRef.current.rotateVal !== INIT_ROTATE) {
            const { naturalWidth: imgWidth, naturalHeight: imgHeight } = imgSource;
            const angle = easyCropRef.current.rotateVal * (Math.PI / 180);

            // get container for rotated image
            const sine = Math.abs(Math.sin(angle));
            const cosine = Math.abs(Math.cos(angle));
            const squareWidth = imgWidth * cosine + imgHeight * sine;
            const squareHeight = imgHeight * cosine + imgWidth * sine;

            canvas.width = squareWidth;
            canvas.height = squareHeight;
            ctx.fillStyle = fillColor;
            ctx.fillRect(0, 0, squareWidth, squareHeight);

            // rotate container
            const squareHalfWidth = squareWidth / 2;
            const squareHalfHeight = squareHeight / 2;
            ctx.translate(squareHalfWidth, squareHalfHeight);
            ctx.rotate(angle);
            ctx.translate(-squareHalfWidth, -squareHalfHeight);

            // draw rotated image
            const imgX = (squareWidth - imgWidth) / 2;
            const imgY = (squareHeight - imgHeight) / 2;
            ctx.drawImage(imgSource, 0, 0, imgWidth, imgHeight, imgX, imgY, imgWidth, imgHeight);

            // crop rotated image
            const imgData = ctx.getImageData(0, 0, squareWidth, squareHeight);
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            ctx.putImageData(imgData, -cropX, -cropY);
        } else {
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            ctx.fillStyle = fillColor;
            ctx.fillRect(0, 0, cropWidth, cropHeight);

            ctx.drawImage(imgSource, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        }

        // get the new image
        const { type, name, uid } = fileRef.current;
        canvas.toBlob(
            async (blob: Blob | null) => {
                const newFile = Object.assign(new File([blob], name, { type }), { uid }) as RcFile;

                if (!beforeUploadRef.current) {
                    return resolveRef.current(newFile);
                }

                const result = await beforeUploadRef.current(newFile, [newFile]);

                if (result === true) {
                    return resolveRef.current(newFile);
                }

                if (result === false) {
                    return rejectRef.current(new Error('beforeUpload return false'));
                }

                delete newFile[AntUpload.LIST_IGNORE];
                if (result === AntUpload.LIST_IGNORE) {
                    Object.defineProperty(newFile, AntUpload.LIST_IGNORE, {
                        value: true,
                        configurable: true
                    });
                    return rejectRef.current(new Error('beforeUpload return LIST_IGNORE'));
                }

                if (typeof result === 'object' && result !== null) {
                    return resolveRef.current(result);
                }
            },
            type,
            quality
        );
    }, [fillColor, quality, rotate]);

    const getComponent = (titleOfModal) => (
        <>
            {uploadComponent}
            {image && (
                <AntModal
                    visible
                    wrapClassName={`${PREFIX}-modal`}
                    title={titleOfModal}
                    onOk={onOk}
                    onCancel={onCancel}
                    maskClosable={false}
                    destroyOnClose
                    {...modalProps}>
                    <EasyCrop
                        ref={easyCropRef}
                        cropperRef={ref}
                        image={image}
                        aspect={aspect}
                        shape={shape}
                        grid={grid}
                        zoom={zoom}
                        rotate={rotate}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        cropperProps={cropperProps} />
                </AntModal>
            )}
        </>
    );

    if (modalTitle) return getComponent(modalTitle);

    return (
        <LocaleReceiver>
            {(locale, code) => getComponent(code === 'zh-cn' ? '编辑图片' : 'Edit image')}
        </LocaleReceiver>
    );
});

export default ImgCrop1;

type EasyCropHandle = {
    rotateVal: number;
    setZoomVal: Dispatch<SetStateAction<number>>;
    setRotateVal: Dispatch<SetStateAction<number>>;
    cropPixelsRef: MutableRefObject<Area>;
};

interface EasyCropProps
    extends Required<
    Pick<
        ImgCropProps,
        'aspect' | 'shape' | 'grid' | 'zoom' | 'rotate' | 'minZoom' | 'maxZoom' | 'cropperProps'
    >
    > {
    cropperRef: ForwardedRef<Cropper>;
    image: string;
}

const EasyCrop = memo(forwardRef<EasyCropHandle, EasyCropProps>((props, ref) => {
    const {
        cropperRef,
        image,

        aspect,
        shape,
        grid,
        zoom,
        rotate,
        minZoom,
        maxZoom,
        cropperProps
    } = props;

    const [crop, onCropChange] = useState<Point>({ x: 0, y: 0 });
    const [cropSize, setCropSize] = useState<Size>({ width: 0, height: 0 });
    const [zoomVal, setZoomVal] = useState(INIT_ZOOM);
    const [rotateVal, setRotateVal] = useState(INIT_ROTATE);
    const cropPixelsRef = useRef<Area>({ width: 0, height: 0, x: 0, y: 0 });

    const onMediaLoaded = useCallback(
        (mediaSize) => {
            const { width, height } = mediaSize;
            const ratioWidth = height * aspect;

            if (width > ratioWidth) {
                setCropSize({ width: ratioWidth, height });
            } else {
                setCropSize({ width, height: width / aspect });
            }
        },
        [aspect]
    );

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        cropPixelsRef.current = croppedAreaPixels;
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            rotateVal,
            setZoomVal,
            setRotateVal,
            cropPixelsRef
        }),
        [rotateVal]
    );

    return (
        <>
            <Cropper
                {...cropperProps}
                ref={cropperRef}
                image={image}
                crop={crop}
                cropSize={cropSize}
                onCropChange={onCropChange}
                aspect={aspect}
                cropShape={shape}
                showGrid={grid}
                zoomWithScroll={zoom}
                zoom={zoomVal}
                rotation={rotateVal}
                onZoomChange={setZoomVal}
                onRotationChange={setRotateVal}
                minZoom={minZoom}
                maxZoom={maxZoom}
                onMediaLoaded={onMediaLoaded}
                onCropComplete={onCropComplete}
                classes={{ containerClassName: `${PREFIX}-container`, mediaClassName: `${PREFIX}-media` }} />
            {/* {zoom && (
                <section className={`${PREFIX}-control ${PREFIX}-control-zoom`}>
                    <button
                        onClick={() => setZoomVal(zoomVal - ZOOM_STEP)}
                        disabled={zoomVal - ZOOM_STEP < minZoom}>
                        －
                    </button>
                    <AntSlider
                        min={minZoom}
                        max={maxZoom}
                        step={ZOOM_STEP}
                        value={zoomVal}
                        onChange={setZoomVal} />
                    <button
                        onClick={() => setZoomVal(zoomVal + ZOOM_STEP)}
                        disabled={zoomVal + ZOOM_STEP > maxZoom}>
                        ＋
                    </button>
                </section>
            )}
            {rotate && (
                <section className={`${PREFIX}-control ${PREFIX}-control-rotate`}>
                    <button
                        onClick={() => setRotateVal(rotateVal - ROTATE_STEP)}
                        disabled={rotateVal === MIN_ROTATE}>
                        ↺
                    </button>
                    <AntSlider
                        min={MIN_ROTATE}
                        max={MAX_ROTATE}
                        step={ROTATE_STEP}
                        value={rotateVal}
                        onChange={setRotateVal} />
                    <button
                        onClick={() => setRotateVal(rotateVal + ROTATE_STEP)}
                        disabled={rotateVal === MAX_ROTATE}>
                        ↻
                    </button>
                </section>
            )} */}
        </>
    );
}))

// export default memo(EasyCrop);
