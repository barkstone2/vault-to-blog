import remarkProperties from "./remarkProperties.js";
import {u} from "unist-builder";
import * as remarkUtil from "../remarkUtils.js";
import * as propertyRemarkUtil from "../propertyRemarkUtils.js";

let inputAst;
let addNewTagSpy;
let addMultiPropertyValueSpy;
let addPropertyValueSpy;
beforeAll(() => {
  addNewTagSpy = vi.spyOn(remarkUtil, 'addNewTag');
  addMultiPropertyValueSpy = vi.spyOn(propertyRemarkUtil, 'addMultiPropertyValue');
  addPropertyValueSpy = vi.spyOn(propertyRemarkUtil, 'addPropertyValue');
})

afterAll(() => {
  vi.clearAllMocks();
})

describe('프로퍼티 파싱 요청 시', () => {
  it('트리의 첫 번째 자식이 yaml 타입이 아닐 경우 변환 로직이 호출되지 않는다.', () => {
    inputAst = u('root', [
      u('text', 'a'),
    ]);
    remarkProperties()(inputAst)
    expect(addNewTagSpy).not.toBeCalled();
  });
  
  it('트리의 첫 번째 자식이 없는 경우 변환 로직이 호출되지 않는다.', () => {
    inputAst = u('root', []);
    remarkProperties()(inputAst)
    expect(addNewTagSpy).not.toBeCalled();
  });
  
  it('트리의 첫 번째 자식이 yaml 타입인 경우 변환 로직이 호출된다.', () => {
    inputAst = u('root', [
      u('yaml', "a: A")
    ]);
    remarkProperties()(inputAst)
    expect(addNewTagSpy).toBeCalled();
  });
  
  it('프로퍼티의 타입이 multitext인 경우 addMultiPropertyValue가 호출된다.', () => {
    vi.spyOn(propertyRemarkUtil, 'getPropertyType').mockImplementation(() => {
      return 'multitext'
    })
    inputAst = u('root', [
      u('yaml', "a: A")
    ]);
    remarkProperties()(inputAst)
    expect(addMultiPropertyValueSpy).toBeCalled();
  });
  
  it('프로퍼티의 타입이 tags인 경우 addMultiPropertyValue가 호출된다.', () => {
    vi.spyOn(propertyRemarkUtil, 'getPropertyType').mockImplementation(() => {
      return 'tags'
    })
    inputAst = u('root', [
      u('yaml', "a: A")
    ]);
    remarkProperties()(inputAst)
    expect(addMultiPropertyValueSpy).toBeCalled();
  });
  
  it('프로퍼티의 타입이 tags와 multitext가 아니면 addPropertyValue가 호출된다.', () => {
    vi.spyOn(propertyRemarkUtil, 'getPropertyType').mockImplementation(() => {
      return 'text'
    })
    inputAst = u('root', [
      u('yaml', "a: A")
    ]);
    remarkProperties()(inputAst)
    expect(addPropertyValueSpy).toBeCalled();
  });
});