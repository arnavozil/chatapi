class DataClass {
    constructor(seed = []){
        this.data = seed;
    };

    retrieveSocketData = id => {
        const socketData = this.data.filter(el => el.socketId === id);
        const remainingData = this.data.filter(el => el.socketId !== id);
        this.data = remainingData;
        return socketData;
    };

    addData = obj => this.data.push(obj);
};