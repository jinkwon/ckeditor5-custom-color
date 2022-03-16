import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Font from "@ckeditor/ckeditor5-font/src/font";

export const FONT_COLORS = {
  '0': {
	light: '#18A618',
	dark: '#b6cbb6',
  },
  '1': {
	light: '#00FFFF',
	dark: '#a5c4c4',
  },
  '2': {
	light: '#eb4034',
	dark: '#946765',
  },
  '3': {
	light: '#c4bf25',
	dark: '#b0ae87',
  }
}

function getClassColorName(attr) {
  for (const className in FONT_COLORS) {
	const o = FONT_COLORS[className];
	if (o.light === attr || o.dark === attr) {
	  return `${className}`;
	}
  }
  return;
}

function initInlineStyle() {
  const inlineStyles = [];

  let i = 0;
  for (const className in FONT_COLORS) {
    const color = FONT_COLORS[className];
    inlineStyles.push(`[data-fc="${i}"]{color:${color.light};}`);
    inlineStyles.push(`[data-fbg="${i}"]{background-color:${color.light};}`);
    inlineStyles.push(`.dark [data-fc="${i}"]{color:${color.dark};}`);
    inlineStyles.push(`.dark [data-fbg="${i}"]{background-color:${color.dark};}`);
    i += 1;
  }

  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = inlineStyles.join('\n');
  document.head.appendChild(style);
}

initInlineStyle();

class CustomFontColor extends Plugin {

  static get requires() {
	return [Font];
  }

  init() {
	const editor = this.editor;

	['fontColor', 'fontBackgroundColor'].forEach((key) => {
	  let attr = '';
	  if (key === 'fontColor') {
		attr = 'fc';
	  } else if (key === 'fontBackgroundColor') {
		attr = 'fbg';
	  }

	  editor.conversion.for('upcast').elementToAttribute({
		view: {
		  name: 'span',
		  attributes: `data-${attr}`,
		},
		model: {
		  key: key,
		  value: (el) => {
			const v = el.getAttribute(`data-${attr}`);
			return FONT_COLORS[v]['light'];
		  },
		},
		converterPriority: 'high'
	  });

	  editor.conversion.for('downcast').attributeToElement({
		model: {
		  key: key,
		},
		view: (code, api) => {
		  try {
			const {writer} = api;
			return writer.createAttributeElement('span', {
			  [`data-${attr}`]: getClassColorName(code, key),
			});
		  } catch (e) {
			console.log(e);
			return null;
		  }
		},
		converterPriority: 'high',
	  });
	});


  }

  static get pluginName() {
	return 'CustomFontColor';
  }
}

export default CustomFontColor;
