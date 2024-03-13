import { bgmdStyle, grdDirection, grdType, positions, repeats, sizes } from "src/types/bgmd";
import { imagePath, localImagePath } from "src/utils/generic";
import { hex,keyword } from "color-convert";
import { KEYWORD } from "color-convert/conversions";
import { gradientDirection, gradientType, positionList, repeatList, sizeList } from "src/utils/stringList";
import { defaultStyle } from "src/utils/defaultObjects";


const filterEmptyCellArrays = (listString:string|null,listStrings: readonly string[]) :  string[] | null  => {
  if(listString===null){return null;}
  const currentValue  = listString.split(' ');
  if(currentValue.length>0){
    const result : string[] = [];
    for(const element of currentValue){
      if(listStrings.find(item=> item === element)!==undefined){
        result.push(element);
      }
    }
    if(result.length>0){return result;}
  }
  return null;
}

export function cleanText(text:string,pattern:RegExp,space:boolean=false){
  if(typeof text !== 'string'){return null}
  if(pattern instanceof RegExp === false){return null;}
  const content = /.*/;
  const whiteSpaces = /( {1,10})?:?/;
  const jumpLine = /(\r\n|\r|\n)/;
  if(text.match(new RegExp(`${pattern.source+whiteSpaces.source+content.source+jumpLine.source}`) )===null){return null}
  let result = text.replace(new RegExp(`${pattern.source+whiteSpaces.source}`),'').replace(jumpLine,'');
  console.log('RESULT DE CLAEAN TEXT =>',result);
  if(!space){return result.replace(/ /g,'');}
  return result;
}

export function cleanSize(text:string):sizes|null{
  const item = cleanText(text,/bgmd-size/);
  return sizeList.find((element) => element === item) !== undefined ? item as sizes : null;
}

export function cleanOpa(text:string):string|null{
  const item = (cleanText(text,/bgmd-opa/))?.match(/0?\.?[0-9]?[0-9]/);
  if(item){
    return item[0];
  }
  return null
}

export function cleanRep(text:string):repeats|null{
  const item = cleanText(text,/bgmd-mode/);
  return repeatList.find((element) => element === item) !== undefined ? item as repeats : null;
}

export function cleanColor(text:string):string[]|null{
  const color = cleanText(text,/bgmd-color/);
  if(color===null){return null}
  if(color.match(/transparent/) !== null){
    return ['transparent'];
  }
  if(color.match(/\(?[012]?[0-9]?[0-9],[012]?[0-9]?[0-9],[012]?[0-9]?[0-9](,0?.[0-9][0-9]?)?\)?/) !== null){
    const rgb = color.replace(/\(|\)| /g,'').split(',');
    if(rgb.length===4){return [`${rgb[0]}`,`${rgb[1]}`,`${rgb[2]}`,`${rgb[3]}`];}
    return [`${rgb[0]}`,`${rgb[1]}`,`${rgb[2]}`];
  }
  if(color.toLowerCase().match(/\#?([0-9]|[a-f]){3,6}/)){
    const rgb = hex.rgb(color);
    return [`${rgb[0]}`,`${rgb[1]}`,`${rgb[2]}`];
  }
  if(keyword.rgb(color as KEYWORD)){
    const rgb = keyword.rgb(color as KEYWORD);
    return [`${rgb[0]}`,`${rgb[1]}`,`${rgb[2]}`];
  }
  return null;
}

export function cleanPosition(text:string):positions[]|null{
  const item = filterEmptyCellArrays(cleanText(text,/bgmd-position/,true),positionList);
  return(item !== null ? item as positions[] : null);
}

export function cleanGradient(text:string):[grdDirection,grdType]{
  let tempResult:[grdDirection,grdType] = ['left','gradient'];
  const item = (cleanText(text,/bgmd-grd/,true))?.split(' ');
  if(item){
    const clearInput:string[] = [];
    item.map((element)=>{
      if(element.length>0 && element.match(/ /g)===null){
        clearInput.push(element);
      }
    });
    if(clearInput && clearInput[0]){
      const tempDirection = filterEmptyCellArrays(clearInput[0],gradientDirection);
      if(tempDirection && tempDirection.length===1){tempResult[0] = tempDirection[0] as grdDirection;}
    }
    if(clearInput && clearInput[1]){
      const tempType = filterEmptyCellArrays(clearInput[1],gradientType);
      if(tempType && tempType.length===1){tempResult[1] = tempType[0] as grdType;}
    }
  }
  return tempResult;
}

export function isImg(imagePath:string): boolean {
  if(typeof imagePath !== 'string'){return false;}
  return imagePath.match(/\.(jpg|jpeg|a?png|webp|avif|gifv?|svg)$/) !== null;
}

export function extractUrlImage(text: string): string | null{
  const fileUrl = cleanText(text,/bgmd-img/);
  let result = null;
  if(fileUrl){ result = imagePath(fileUrl); }
  if(result===null && fileUrl!==null){
    const vaultList = this?.app?.vault;
    if(vaultList!==undefined){
      return localImagePath(vaultList,fileUrl);
    }
  }
  return result;
}

export function createStyleFromDoc(data:string):bgmdStyle{
  let tempStyle = {...defaultStyle};
  let tempOpa : any = {default:tempStyle.opa};
  if(typeof data !== 'string'){return tempStyle;}
  const bgmdMatch = data.match(/bgmd.*(\r\n|\r|\n)/g);
  if(bgmdMatch===null){return tempStyle;}
  bgmdMatch.map((element)=>{
    if(element.search(/bgmd-img/)!==-1 && extractUrlImage(element)!==null){
      tempStyle.bgi=`${extractUrlImage(element)}`;
    }
    if(element.search(/bgmd-pos/)!==-1){
      tempStyle.pos=cleanPosition(element) ?? tempStyle.pos;
    }
    if(element.search(/bgmd-rep/)!==-1){
      tempStyle.rep=cleanRep(element)??tempStyle.rep;
    }
    if(element.search(/bgmd-size/)!==-1){
      tempStyle.siz= cleanSize(element) ?? tempStyle.siz;
    }
    if(element.search(/bgmd-color/)!==-1){
      const tempColor = cleanColor(element);
      tempStyle.bgc= tempColor?`${tempColor[0]},${tempColor[1]},${tempColor[2]}`:tempStyle.bgc;
      if(tempColor?.length===4){tempOpa.color=tempColor[4];}
    }
    if(element.search(/bgmd-opa/)!==-1){
      tempOpa.input=cleanOpa(element);
    }
    if(element.search(/bgmd-grd/)!==-1){
      tempStyle.grd=cleanGradient(element);
    }
  });
  tempStyle.opa = tempOpa.input ?? tempOpa.color ?? tempOpa.default;
  return tempStyle;
}