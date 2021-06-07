const randomWord = (len = 4) => {
    const legend = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

    let str = '';
    for(let i = 0; i < len; i++){
        const num = Math.floor(Math.random() * legend.length);
        str += legend[num];
    };

    return str;
}

module.exports = {
    randomWord
};