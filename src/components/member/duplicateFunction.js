export const disappear = (setShowErrorMessage) => {
    setShowErrorMessage(true);        
    const timer = setTimeout(() => {
        setShowErrorMessage(false)
    }, 2000);
    return () => clearTimeout(timer);
}