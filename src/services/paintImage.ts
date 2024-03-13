import { MarkdownView } from "obsidian";
import { createStyleFromDoc } from "./extractByMatchs";
import { bgmdStyle } from "src/types/bgmd";
import { gradientDirection, gradientType } from "src/utils/stringList";

export function paintBgArea(toApply: MarkdownView, data: string | null = null) {
  if(toApply===undefined || toApply.editor === undefined ){return null};
  let captureDivToApply = toApply.containerEl.getElementsByClassName('markdown-reading-view')[0] ?? false;
  const applyToAdditionalClass = toApply.containerEl.getElementsByClassName('view-content')[0] ?? false;
  const value = createStyleFromDoc(data ?? toApply.editor.getDoc().getValue());
  const cssClassName = 'forced-style-bgmd';
  const gradientClassName = `${value.grd[0]}-${value.grd[1]}`;
  if(captureDivToApply && applyToAdditionalClass){
    if(value.bgi!==null){
      createCssBg(value,captureDivToApply);
      applyToAdditionalClass.addClass(cssClassName);
      clearClassGrdTypes(applyToAdditionalClass);
      if(value.grd[1]!=='none'){
        applyToAdditionalClass.addClass(gradientClassName);
      }
    }else{
      const HTMLItem = captureDivToApply as HTMLElement;
      applyToAdditionalClass.removeClass(cssClassName);
      applyToAdditionalClass.removeClass(gradientClassName);
      deleteCssBg(HTMLItem);
      clearClassGrdTypes(HTMLItem);
    }
  }
}

function clearClassGrdTypes(htmlObjetive:Element){
  gradientDirection.forEach(direction => {
    gradientType.forEach(type => {
      if(type!=='none'){
        htmlObjetive as HTMLElement;
        htmlObjetive.removeClass(`${direction}-${type}`);
      }
    });
  });
}

function createCssBg(style:bgmdStyle,placeBgcImage:Element) {
  const tempValue = placeBgcImage as HTMLElement;
  tempValue.style.setProperty('--bgmd-img',`url('${style.bgi}')`);
  tempValue.style.setProperty('--bgmd-color',`${style.bgc}`);
  tempValue.style.setProperty('--bgmd-opa',`${style.opa}`);
  tempValue.style.setProperty('--bgmd-pos',`${style.pos.join(' ')}`);
  tempValue.style.setProperty('--bgmd-size',`${style.siz}`);
  tempValue.style.setProperty('--bgmd-rep',`${style.rep}`);
}

function deleteCssBg(placeBgcImage:Element) {
  const tempValue = placeBgcImage as HTMLElement;
  tempValue.style.removeProperty('--bgmd-img');
  tempValue.style.removeProperty('--bgmd-color');
  tempValue.style.removeProperty('--bgmd-opa');
  tempValue.style.removeProperty('--bgmd-pos');
  tempValue.style.removeProperty('--bgmd-size');
  tempValue.style.removeProperty('--bgmd-rep');
}