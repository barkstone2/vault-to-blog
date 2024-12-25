import {
  addMultiPropertyValue,
  addPropertyValue,
  getPropertyType,
  parseKeyAndValue
} from "./propertyRemarkUtils.js";
import {describe, vi} from "vitest";
import fs from "fs";

function wrapTagByObject(tag) {
  return {
    type: 'html',
    value: tag
  }
}

describe('parseKeyAndValue 호출 시', () => {
  let property;
  it(`프로퍼티가 "-" 문자로 시작하지 않으면 ":" 문자를 기준으로 키와 값으로 분리된다.`, () => {
    const keyInput = 'key'
    const valueInput = 'value';
    property = `${keyInput}: ${valueInput}`;
    const {key, value} = parseKeyAndValue(property);
    expect(key).toBe(keyInput)
    expect(value).toBe(valueInput)
  });
  
  it('프로퍼티가 "-" 문자로 시작하면, 값만 반환된다.', () => {
    const valueInput = 'value';
    property = `  - ${valueInput}`;
    const {key, value} = parseKeyAndValue(property);
    expect(key).toBe('')
    expect(value).toBe(valueInput)
  });
});

describe('addPropertyValue 호출 시', () => {
  let value = 'default value';
  let expectedTag;
  const nodes = [];
  let spy;
  beforeAll(() => {
    spy = vi.spyOn(nodes, 'push');
  })
  afterAll(() => {
    vi.clearAllMocks();
  })
  
  it('number 타입인 경우 알맞은 태그가 추가된다.', () => {
    expectedTag = `<input class="metadata-input metadata-input-number" tabindex="-1" type="number" placeholder="Empty" value="${value}">`
    addPropertyValue(nodes, value, 'number');
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('datetime 타입인 경우 알맞은 태그가 추가된다.', () => {
    expectedTag = `<input class="metadata-input metadata-input-text mod-datetime" tabindex="-1" type="datetime-local" placeholder="Empty" value="${value}">`
    addPropertyValue(nodes, value, 'datetime');
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('date 타입인 경우 알맞은 태그가 추가된다.', () => {
    expectedTag = `<input class="metadata-input metadata-input-text mod-date is-empty" tabindex="-1" type="date" placeholder="Empty" value="${value}">`
    addPropertyValue(nodes, value, 'date');
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('checkbox 타입인 경우 알맞은 태그가 추가된다.', () => {
    expectedTag = `<input class="metadata-input-checkbox" tabindex="-1" type="checkbox" data-indeterminate="false" ${value ? 'checked' : ''} onclick="return false;">`
    addPropertyValue(nodes, value, 'checkbox');
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('text 타입인 경우 알맞은 태그가 추가된다.', () => {
    expectedTag = `<div class="metadata-input-longtext mod-truncate" tabindex="-1" placeholder="Empty">${value}</div>`
    addPropertyValue(nodes, value, 'text');
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('타입 정보가 올바르지 않으면 text 타입의 태그가 추가된다.', () => {
    expectedTag = `<div class="metadata-input-longtext mod-truncate" tabindex="-1" placeholder="Empty">${value}</div>`
    addPropertyValue(nodes, value, 'unknown');
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
});

describe('getPropertyType 호출 시', () => {
  it('types.json 파일이 존재하지 않는 경우 text 타입이 반환된다.', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(() => {
      return false;
    })
    const result = getPropertyType('aa');
    expect(result).toBe('text');
    vi.clearAllMocks();
  });
  
  it('맵에 정보가 있는 key인 경우 기록된 타입이 반환된다.', () => {
    const key = 'key';
    const type = 'date';
    vi.spyOn(JSON, 'parse').mockImplementation(() => {
      return {
        types: {
          [key]: `${type}`
        }
      }
    })
    const result = getPropertyType(key);
    expect(result).toBe(type);
    vi.clearAllMocks()
  });
  
  it('맵에 정보가 없는 key인 경우 text 타입이 반환된다.', () => {
    const key = 'key';
    vi.spyOn(JSON, 'parse').mockImplementation(() => {
      return {
        types: {}
      }
    })
    const result = getPropertyType(key);
    expect(result).toBe('text');
    vi.clearAllMocks()
  });
});


describe('addMultiPropertyValue 호출 시', () => {
  let index;
  let properties;
  let type;
  let expectedTag;
  const nodes = [];
  let spy;
  beforeEach(() => {
    spy = vi.spyOn(nodes, 'push');
  })
  afterEach(() => {
    vi.clearAllMocks();
  })
  
  it('index+1이 properties 길이와 같으면 while문 본문이 호출되지 않는다.', () => {
    properties = ['key: value']
    index = properties.length-1;
    type = 'text';
    addMultiPropertyValue(nodes, type, properties, index);
    expect(spy).toHaveBeenCalledTimes(2)
  });
  
  it('index+1이 properties 길이보다 크면 while문 본문이 호출되지 않는다.', () => {
    properties = ['key: value']
    index = 3;
    type = 'text';
    addMultiPropertyValue(nodes, type, properties, index);
    expect(spy).toHaveBeenCalledTimes(2)
  });
  
  it('parseKeyAndValue의 반환 결과 key 값이 존재하면 이후의 로직이 실행되지 않는다.', () => {
    properties = ['key: value', 'key2: value']
    index = 0;
    type = 'text';
    const returnIndex = addMultiPropertyValue(nodes, type, properties, index);
    expect(returnIndex).toBe(index);
  });
  
  it('key 값이 존재하지 않고 multitext 타입이면 타입에 맞는 태그가 추가된다.', () => {
    const value = 'value';
    expectedTag = `<div class="multi-select-pill"><div class="multi-select-pill-content">${value}</div></div>`;
    properties = ['parent: parent', '  - ' + value]
    index = 0;
    type = 'multitext';
    addMultiPropertyValue(nodes, type, properties, index);
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('key 값이 존재하지 않고 tags 타입이면 타입에 맞는 태그가 추가된다.', () => {
    const value = 'value';
    expectedTag = `<div class="multi-select-pill" tabindex="0"><div class="multi-select-pill-content"><span>${value}</span></div></div>`;
    properties = ['parent: parent', '  - ' + value]
    index = 0;
    type = 'tags';
    addMultiPropertyValue(nodes, type, properties, index);
    expect(spy).toHaveBeenCalledWith(wrapTagByObject(expectedTag))
  });
  
  it('key 값이 없는 프로퍼티가 여러개면 모두 추가된다.', () => {
    const values = ['value1', 'value2', 'value3']
    properties = ['parent: parent', `  - ${values[0]}`, ` - ${values[1]}`, `- ${values[2]}`]
    const expectedTags = [];
    for (const value of values) {
      expectedTags.push(`<div class="multi-select-pill"><div class="multi-select-pill-content">${value}</div></div>`)
    }
    index = 0;
    type = 'multitext';
    addMultiPropertyValue(nodes, type, properties, index);
    for (const tag of expectedTags) {
      expect(spy).toHaveBeenCalledWith(wrapTagByObject(tag));
    }
  });
  
  it('마지막으로 추가한 자식 인덱스를 반환한다.', () => {
    const values = ['value1', 'value2']
    properties = ['parent: parent', `  - ${values[0]}`, ` - ${values[1]}`, `key: value3`]
    index = 0;
    type = 'multitext';
    const resultIndex = addMultiPropertyValue(nodes, type, properties, index);
    expect(resultIndex).toBe(index + values.length);
  });
});