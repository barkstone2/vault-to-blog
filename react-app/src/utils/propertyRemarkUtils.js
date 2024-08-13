import {loadPropertySVGSync} from "./svg/svgUtils.js";
import {addNewTag} from "./remarkUtils.js";
import fs from "fs";

export function addPropertyKey(nodes, key, type) {
  nodes.push({
    type: 'html',
    value:
      `<div class="metadata-property-key">
        <div class="metadata-property-icon" aria-disabled="false">${loadPropertySVGSync(type)}</div>
        <input class="metadata-property-key-input" tabindex="-1" type="text" aria-label="${key}" value="${key}"/>
      </div>`
  });
}

export function addPropertyValue(nodes, value, type) {
  addNewTag(nodes, `<div class="metadata-property-value" tabindex="-1">`, '</div>',
    () => {
      nodes.push({
        type: 'html',
        value: createValueTag(type, value)
      })
    });
}

function createValueTag(type, value) {
  let valueTag;
  if (type === 'number') {
    valueTag = `<input class="metadata-input metadata-input-number" tabindex="-1" type="number" placeholder="Empty" value="${value}">`
  } else if (type === 'datetime') {
    valueTag = `<input class="metadata-input metadata-input-text mod-datetime" tabindex="-1" type="datetime-local" placeholder="Empty" value="${value}">`
  } else if (type === 'date') {
    valueTag = `<input class="metadata-input metadata-input-text mod-date is-empty" tabindex="-1" type="date" placeholder="Empty" value="${value}">`
  } else if (type === 'checkbox') {
    valueTag = `<input class="metadata-input-checkbox" tabindex="-1" type="checkbox" data-indeterminate="false" ${value ? 'checked' : ''} onclick="return false;">`
  } else {
    valueTag = `<div class="metadata-input-longtext mod-truncate" tabindex="-1" placeholder="Empty">${value}</div>`
  }
  return valueTag;
}

export function parseKeyAndValue(property) {
  let key = '';
  let value;
  property = property = property.trimStart();
  if (property.startsWith('-')) {
    value = property.slice(2);
  } else {
    const split = property.split(':')
    key = split[0]
    value = split.slice(1).join(':').trimStart();
  }
  return {key, value};
}

export function addMultiPropertyValue(nodes, type, properties, index) {
  addNewTag(nodes,
    `<div class="metadata-property-value"><div class="multi-select-container">`,
    `</div></div>`,
    () => {
      while (index + 1 < properties.length) {
        const nextProperty = properties[index + 1];
        const {key, value} = parseKeyAndValue(nextProperty)
        if (key) break;
        nodes.push({
          type: 'html',
          value: createMultiValueTag(type, value)
        })
        index++;
      }
    }
  );
  return index;
}

function createMultiValueTag(type, value) {
  let valueTag;
  if (type === 'multitext') {
    valueTag = `<div class="multi-select-pill"><div class="multi-select-pill-content">${value}</div></div>`;
  } else {
    valueTag = `<div class="multi-select-pill" tabindex="0"><div class="multi-select-pill-content"><span>${value}</span></div></div>`
  }
  return valueTag;
}

const typesPath = 'public/types.json';
export function getPropertyType(key) {
  const types = fs.existsSync(typesPath) ? fs.readFileSync(typesPath, 'utf-8') : '{}';
  const typesMap = JSON.parse(types).types ?? {};
  return typesMap[[key]] ?? 'text';
}