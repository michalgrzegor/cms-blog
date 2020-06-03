import '../../style/components_style/editor.scss';

import EditorJS from '@editorjs/editorjs';
import options from './editor-options';
import {fireBtn, fireLoadBtn} from './editor-func';

const editor = new EditorJS(options);
fireBtn(editor);
fireLoadBtn(editor);
