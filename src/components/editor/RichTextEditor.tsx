import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './RichTextEditor.css'
import { uploadImageApi } from '@/request'
import { FirstIndentClass, FirstIndentStyle } from './firstIndent';

type editorPropType = {
    category: string
    content: any
    onChange: (content: any) => void
}

export class RichTextEditor extends React.Component<editorPropType, any> {
    reactQuillRef: ReactQuill
    // componentDidMount() {
    //     Quill.register({
    //         'attributors/class/firstIndent': FirstIndentClass,
    //         'attributors/style/firstIndent': FirstIndentStyle,
    //     }, true);

    //     Quill.register({
    //         'formats/firstIndent': FirstIndentClass,
    //     }, true);

    //     Quill.register({
    //         'modules/firstIndent': FirstIndentClass,
    //     }, true);
    // }

    modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                // [{ size: [false, 'small', 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ script: 'sub' }, { script: 'super' }],
                [{ align: [] }],
                [{ color: [] }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ direction: 'rtl' }],
                ['formula'],
                ['link', 'image', 'video'],
                // [{ firstIndent: [false, '2', '3', '4'] }],
                ['clean']
            ],
            // firstIndent: {
            //     container: '#RichTextEditor'
            // },
            handlers: {
                image: this.imageHandler.bind(this),
                firstIndent: this.firstIndentHandler.bind(this)
                // size: this.sizeH.bind(this),
            }
        }
    }

    formats = [
        "header",
        // "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "script",
        "align",
        "color",
        "indent",
        "list",
        "direction",
        "formula",
        // "bullet",
        "link",
        "image",
        "video",
        "firstIndent",
        "clean"
    ];

    sizeH(e) {
        const editor = this.reactQuillRef.getEditor();
        editor.format('size', e);
    }

    imageHandler() {
        const {
            category
        } = this.props
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
            if (input.files) {
                const file = input.files[0]
                const formData = new FormData()
                formData.append('file', file)
                const res: any = await uploadImageApi({ file: formData, file_type: 'pic', category })
                const range = this.reactQuillRef.getEditor().getSelection()
                const link = res.data.url
                this.reactQuillRef.getEditor().insertEmbed(range.index, 'image', link)
                this.reactQuillRef.getEditor().setSelection(range.index + 1, range.length)
            }
        }
    }

    firstIndentHandler(e) {
        console.log('00', e)
        const editor = this.reactQuillRef.getEditor();
        const cursorPosition = editor.getSelection();
        const a = editor.getContents();
        const b = editor.getBounds(cursorPosition.index);
        const c = editor.getFormat(cursorPosition.index);
        const d = editor.getModule('firstIndent');
        const f = editor.getLine(cursorPosition.index);
        console.log('00', cursorPosition);
        console.log('getContents', a);
        console.log('getBounds', b);
        console.log('getFormat', c);
        console.log('getModule', d);
        console.log('getLine', f);
        // f[0].domNode.style.cssText=`text-indent:${e}em`;

        editor.format('firstIndent', e, 'user');
        // editor.format('firstIndent', e);

        // editor.formatText(cursorPosition.index, cursorPosition.length, 'firstIndent', e, 'api');

        // this.reactQuillRef.getEditor().insertText(cursorPosition.index, "★");
        // this.reactQuillRef.getEditor().setSelection(cursorPosition.index + 1, cursorPosition.length);

        // let c = this.reactQuillRef.getEditor().getContents()
        // let t = this.reactQuillRef.getEditor().getText()

        // console.log(111111, c)
        // console.log(22222, t)

        // this.reactQuillRef.getEditor().formatText(cursorPosition,'insertStar')

        // this.reactQuillRef.getEditor().addContainer register('modules/counter', function (quill, options) {
        //     var container = document.querySelector('#counter');
        //     quill.on('text-change', function () {
        //         var text = quill.getText();
        //         // There are a couple issues with counting words
        //         // this way but we'll fix these later
        //         container.innerText = text.split(/\s+/).length;
        //     });
        // });
    }

    render() {
        const {
            content,
            onChange
        } = this.props

        return (
            <ReactQuill
                style={{ height: 300 }}
                id="RichTextEditor"
                theme="snow"
                ref={(el) => { this.reactQuillRef = el }}
                modules={this.modules}
                formats={this.formats}
                value={content}
                onChange={onChange} />
        )
    }
}
