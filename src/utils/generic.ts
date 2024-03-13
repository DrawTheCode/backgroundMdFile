import { Vault } from "obsidian";
import { isImg } from "src/services/extractByMatchs";

export function imagePath(imageMatch:string): string|null {
  if(imageMatch){
    try { 
      const tempUrl = new URL(imageMatch);
      if(isImg(tempUrl.pathname)){
        return imageMatch;
      }
    }
    catch(e){
      console.error('Error detectado=>',e);
      return null;
    }
  }
  return null;
}

export function localImagePath(vault:Vault,imageMatch:string): string | null{
  let result: string | null = null;
  if(imageMatch && imageMatch.match(/\[\[.*\]\]/)!==null){
    imageMatch = imageMatch.replace('[[','').replace(']]','').replace(/\"/g,'');
    const file = imageMatch.split('.');
    if(file.length>0 && isImg(imageMatch)){
      const fileListInVault = vault.getFiles();
      let fileName = file[0].replace(/ /g,'');
      if(fileName.match(/\/.*$/)!==null){
        const currentValue = fileName.split('/');
        fileName =currentValue[currentValue.length - 1];
      }
      const tempResult = fileListInVault.find((element) => element.basename === fileName && element.extension === file[1]);
      if(tempResult!==undefined){
        result=tempResult.vault.getResourcePath(tempResult);
      }
    }
  }
  return result;
}