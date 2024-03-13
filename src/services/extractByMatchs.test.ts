import { expect, describe, it } from "vitest";
import { cleanColor, cleanPosition, cleanRep, cleanSize, cleanText, createStyleFromDoc, extractUrlImage, isImg } from "./extractByMatchs";
import { defaultStyle } from "src/utils/defaultObjects";

const patternDefault = /bgmd/;
const patternPosition = /bgmd-position/;

describe('cleanText', (): void =>{
  it('If parameter input not is a string, return null.',(): void => {
    expect(cleanText(1,patternDefault)).toBeNull();
    expect(cleanText(false,patternDefault)).toBeNull();
    expect(cleanText(3.15,patternDefault,true)).toBeNull();
    expect(cleanText([],patternDefault)).toBeNull();
    expect(cleanText(null,patternDefault,true)).toBeNull();
  });

  it('If input string not is correct with RegExp input, rerturn null.', ():void =>{
    expect(cleanText('',patternDefault)).toBeNull();
    expect(cleanText('bgmd-position: left top\n',patternDefault,true)).toBeNull();
  });

  it('If second parameter not is a RegExp, return null.', ():void =>{
    expect(cleanText('',patternDefault)).toBeNull();
    expect(cleanText('bgmd-position: left top\n','prueba',true)).toBeNull();
  });

  it('If first and second inputs are corrects, return string without spaces.', ():void => {
    expect(cleanText('bgmd: [[SEHtop7KL_1256x620__1.webp]]\n',patternDefault)).toBe('[[SEHtop7KL_1256x620__1.webp]]');
  });

  it('If third value exist and is true, return string with spaces.', ():void => {
    expect(cleanText('bgmd-position: left top\n',patternPosition,true)).toBe(' left top');
  });
});

describe('cleanSize', (): void =>{
  it('If parameter input not is a string, return null.',(): void => {
    expect(cleanSize(1)).toBeNull();
    expect(cleanSize(false)).toBeNull();
    expect(cleanSize(3.15)).toBeNull();
    expect(cleanSize([])).toBeNull();
    expect(cleanSize(null)).toBeNull();
  });

  it('If input string not is correct with RegExp input (bgmd-position:), rerturn null.', ():void =>{
    expect(cleanSize('')).toBeNull();
    expect(cleanSize('bgmd-position: left top\n')).toBeNull();
  });

  it('If input string satisfy RegExp (bgmd-position:) this return a one of posible results.', ():void => {
    expect(cleanSize('bgmd-size: contain \n')).toBe('contain');
  });
});

describe('cleanRep', (): void =>{
  it('If parameter input not is a string, return null.',(): void => {
    expect(cleanRep(1)).toBeNull();
    expect(cleanRep(false)).toBeNull();
    expect(cleanRep(3.15)).toBeNull();
    expect(cleanRep([])).toBeNull();
    expect(cleanRep(null)).toBeNull();
  });

  it('If input is a string but not satisfy RegExp, return a null.', ():void =>{
    expect(cleanRep('')).toBeNull();
    expect(cleanRep('bgmd-position: left top\n')).toBeNull();
  });

  it('If input value is a string but not satisfy RegExp (bgmd-mode:), return null.', ():void => {
    expect(cleanRep('bgmd-mode: algoNoReal \n')).toBeNull();
  });

  it('If input is a string and satisfy RegExp (bgmd-mode:), return a valid string without spaces.', ():void => {
    expect(cleanRep('bgmd-mode: repeat \n')).toBe('repeat');
  });
});

describe('cleanColor', (): void =>{
  it('If parameter input not is a string, return null.',(): void => {
    expect(cleanColor(1)).toBeNull();
    expect(cleanColor(false)).toBeNull();
    expect(cleanColor(3.15)).toBeNull();
    expect(cleanColor([])).toBeNull();
    expect(cleanColor(null)).toBeNull();
  });

  it('If input is a string and not satisfy RegExp (bgmd-color:), return null', ():void =>{
    expect(cleanColor('')).toBeNull();
    expect(cleanColor('bgmd-position: left top\n')).toBeNull();
  });

  it('If input string satisfy RegExp (bgmd-color:), return RGB in a Array of strings.', ():void => {
    expect(cleanColor('bgmd-color: red \n')).toStrictEqual(['255','0','0']);
    expect(cleanColor('bgmd-color: #00FF00 \n')).toStrictEqual(['0','255','0']);
    expect(cleanColor('bgmd-color: (0,0,255) \n')).toStrictEqual(['0','0','255']);
  });
});

describe('cleanPosition', (): void =>{
  it('If parameter input not is a string, return null.',(): void => {
    expect(cleanPosition(1)).toBeNull();
    expect(cleanPosition(false)).toBeNull();
    expect(cleanPosition(3.15)).toBeNull();
    expect(cleanPosition([])).toBeNull();
    expect(cleanPosition(null)).toBeNull();
  });

  it('If input value is a string but not satisfy RegExp (bgmd-position:), return null.', ():void =>{
    expect(cleanPosition('')).toBeNull();
    expect(cleanPosition('bgmd-color: red \n')).toBeNull();
    expect(cleanPosition('bgmd-color: #FF0000 \n')).toBeNull();
  });

  it('If input string satisfy RegExp (bgmd-position:), return a array of string with valid values.', ():void => {
    expect(cleanPosition('bgmd-position: left top \n')).toStrictEqual(['left','top']);
  });
});

describe('isImg', (): void =>{
  it('If input value not is a string, return false.',(): void => {
    expect(isImg(1)).toBe(false);
    expect(isImg(false)).toBe(false);
    expect(isImg(3.15)).toBe(false);
    expect(isImg([])).toBe(false);
    expect(isImg(null)).toBe(false);
  });

  it('If input value is a string but not end in image extension file, return false.', ():void =>{
    expect(isImg('')).toBe(false);
    expect(isImg('bgmd-color: red \n')).toBe(false);
    expect(isImg('bgmd-color: #FF0000 \n')).toBe(false);
    expect(isImg('https://www.google.com')).toBe(false);
  });

  it('If input value is a string and extension file is a image extension, return true.', ():void => {
    expect(isImg('SEHtop7KL_1256x620__1.webp')).toBe(true);
    expect(isImg('https://64.media.tumblr.com/fa662e4c43b13a92367778e6ff79f20e/544314e20212eeb7-12/s540x810/d620589a5bdcb4dad4ad9ec70ffd47e360b32860.gif')).toBe(true);
  });
});

describe('extractUrlImage', (): void =>{
  it('If parameter input not is a string, return null.',(): void => {
    expect(extractUrlImage(1)).toBeNull();
    expect(extractUrlImage(false)).toBeNull();
    expect(extractUrlImage(3.15)).toBeNull();
    expect(extractUrlImage([])).toBeNull();
    expect(extractUrlImage(null)).toBeNull();
  });

  it('If input value is a string but not satisfy RegExp (bgmd-color:) and is a not valid image path or string, return null.', ():void =>{
    expect(extractUrlImage('')).toBeNull();
    expect(extractUrlImage('bgmd-color: red \n')).toBeNull();
    expect(extractUrlImage('bgmd-color: #FF0000 \n')).toBeNull();
    expect(extractUrlImage('https://www.google.com')).toBeNull();
  });

  it('If inpur value is a string, fulfil RegExp (bgmd:) and ends in a valid image format, return path or name image without spaces.', ():void => {
    const testB = cleanText('bgmd:https://64.media.tumblr.com/fa662e4c43b13a92367778e6ff79f20e/544314e20212eeb7-12/s540x810/d620589a5bdcb4dad4ad9ec70ffd47e360b32860.gif\n',patternDefault);
    expect(extractUrlImage(testB)).toBe('https://64.media.tumblr.com/fa662e4c43b13a92367778e6ff79f20e/544314e20212eeb7-12/s540x810/d620589a5bdcb4dad4ad9ec70ffd47e360b32860.gif');
  });
});

describe('createStyleFromDoc', (): void =>{
  const exampleTextFine = `
  bgmd: https://64.media.tumblr.com/fa662e4c43b13a92367778e6ff79f20e/544314e20212eeb7-12/s540x810/d620589a5bdcb4dad4ad9ec70ffd47e360b32860.gif
  bgmd-position: left top
  bgmd-color: (255,0,0,0.4)
  bgmd-size: contain
  bgmd-mode: repeat
  `;

  const exampleTextFineResult = {
    "bgc": "255,0,0",
    "bgi": "https://64.media.tumblr.com/fa662e4c43b13a92367778e6ff79f20e/544314e20212eeb7-12/s540x810/d620589a5bdcb4dad4ad9ec70ffd47e360b32860.gif",
    "pos": ["left","top"],
    "rep": "repeat",
    "siz": "contain"
  };

  it('If input value not is a string, return a default object.',(): void => {
    expect(createStyleFromDoc(1)).toStrictEqual(defaultStyle);
    expect(createStyleFromDoc(false)).toStrictEqual(defaultStyle);
    expect(createStyleFromDoc(3.15)).toStrictEqual(defaultStyle);
    expect(createStyleFromDoc([])).toStrictEqual(defaultStyle);
    expect(createStyleFromDoc(null)).toStrictEqual(defaultStyle);
  });

  it('If input not satisfy the RegExp, return defaul value', ():void =>{
    expect(createStyleFromDoc('')).toStrictEqual(defaultStyle);
    expect(createStyleFromDoc('https://www.google.com')).toStrictEqual(defaultStyle);
    
  });

  it('If input value is correct, but some value satisfy any of posible outputs, return defaul value with parameter satisfy value where correspond.', ():void => {
    let testingColorA = {...defaultStyle};
    testingColorA.bgc = '255,0,0';
    let testingResultWrote = {...defaultStyle}
    testingResultWrote.siz='contain';
    testingResultWrote.rep='repeat';

    const wroteInput = `
    bgmd-img:-xd https://64.media.tumblr.com/fa662e4c43b13a92367778e6ff79f20e/544314e20212eeb7-12/s540x810/d620589a5bdcb4dad4ad9ec70ffd47e360b32860.gif
    bgmd-position----: left top
    bgmd-extreme-color: (255,0,0,0.4)
    bgmd-size: contain
    bgmd-rep: repeat
    `;
    expect(createStyleFromDoc('bgmd-color: red \n')).toStrictEqual(testingColorA);
    expect(createStyleFromDoc('bgmd-color: #FF0000 \n')).toStrictEqual(testingColorA);
    expect(createStyleFromDoc(wroteInput)).toStrictEqual(testingResultWrote);
  });

  it('If input value is a string and value is a correct format, return object with values designated in string.', ():void => {
    expect(createStyleFromDoc(exampleTextFine)).toStrictEqual(exampleTextFineResult);
  });
});