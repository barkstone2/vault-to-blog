import {visit} from 'unist-util-visit';
import {h} from 'hastscript';
import {calloutSvgPath, loadCalloutSVGSync} from "../svg/svgUtils.js";

const rehypeCallout = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return;
      const indicatorNode = node.children[1];
      if (isCallout(indicatorNode)) {
        const {calloutTitle, calloutType, isFoldable, foldableState} = parseIndicatorNode(indicatorNode);
        const calloutClass = determineClass(isFoldable, foldableState);
        const iconName = `${calloutType}`;
        const calloutContent = node.children.slice(1)
        calloutContent[0].children = calloutContent[0].children.slice(1);
        
        node.type = 'element';
        node.tagName = 'div';
        
        node.children = [
          h('div',
            {
              'data-callout-metadata': '',
              'data-callout-fold': foldableState,
              'data-callout': calloutType,
              class: calloutClass,
            },
            [
              h('div', {class: 'callout-title', dir: 'auto'}, [
                h('div', {class: 'callout-icon'}, [
                  loadCalloutSVGSync(calloutSvgPath(iconName)),
                ]),
                h('div', {class: 'callout-title-inner'}, calloutTitle),
                h('div', {class: 'callout-fold'}, [
                  // TODO fold용 svg 추가, 폴드 시에는 content display none하는 이벤트 추가;
                ]),
              ]),
              h('div', {class: 'callout-content'}, calloutContent),
            ]
          )
        ];
        
        indicatorNode.children.shift();
      }
    });
  };
}

function isCallout(indicatorNode) {
  const indicatorValue = indicatorNode?.children?.[0]?.value;
  return indicatorNode?.tagName === 'p' && typeof indicatorValue === 'string' && /\[!.*]/.test(indicatorValue)
}

function parseIndicatorNode(indicatorNode) {
  const indicator = indicatorNode.children[0];
  const indications = indicator.value.split(' ');
  const {calloutType, isFoldable, foldableState} = parseTypeAndFoldable(indications[0]);
  const calloutTitle = parseTitle(indications, calloutType);
  return {calloutTitle, calloutType, isFoldable, foldableState}
}

function parseTypeAndFoldable(indication) {
  let isFoldable = false;
  let foldableState = '';
  let calloutType = indication.slice(2);
  if (isFoldableCallout(indication)) {
    isFoldable = true;
    foldableState = calloutType.slice(-1);
    calloutType = calloutType.slice(0, -2);
  } else {
    calloutType = calloutType.slice(0, -1);
  }
  return {calloutType, isFoldable, foldableState};
}

function isFoldableCallout(indication) {
  return indication.match(/\[!.*](?=[+-])/)
}

function parseTitle(indications, calloutType) {
  let calloutTitle;
  if (indications.length > 1) {
    calloutTitle = indications.slice(1).join(' ');
  } else {
    calloutTitle = calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
  }
  return calloutTitle;
}

function determineClass(isFoldable, foldableState) {
  let calloutClass = 'callout';
  if (isFoldable) {
    calloutClass += ' is-collapsible';
    if (foldableState === '-') {
      calloutClass += ' is-collapsed';
    }
  }
  return calloutClass;
}

export default rehypeCallout
