type Dimensions = {
    width: number,
    height: number,
};

function getHtmlElementDimensions(element: HTMLElement): Dimensions {
    return {
        width: element.clientWidth,
        height: element.clientHeight,
    };
}

export { Dimensions, getHtmlElementDimensions };