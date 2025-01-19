const flashingClass = 'is-flashing';
function removeFlashingElement() {
    const flashingClasses = document.querySelectorAll(`.${flashingClass}`);
    flashingClasses.forEach((el) => {
        el.classList.remove(flashingClass);
    })
}

export function useFlashingElement() {
    const flashElementById = (targetId: string, duration: number = 2000) => {
        removeFlashingElement();
        const targetElement = document.getElementById(targetId);
        targetElement?.classList.add('is-flashing');
        setTimeout(() => {
            targetElement?.classList.remove('is-flashing');
        }, duration);
    }
    return {flashElementById};
}