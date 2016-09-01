

/**
 * 生成简化的GUID
 * @method __getID
 * @return {String}
 */
function getID() {
    let d = new Date().getTime();
    return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
};

/**
 * 自动调频
 * @method optFreq
 * @param  {Float} newFreq 新周期
 */
function autoFreq(frameCycle) {
    // 高精度模式
    if (this.autoFreqMode === 'turbo') {
        let endTime = new Date().getTime();

        if (this._autoFreqTimmer > 30) {
            let oldSam = this.samsaraCount;
            this._autoFreqTimmer = 0;
            // if (this._bufferFunCycle.reduce((pre, cur) => pre + cur) / 30 < 8.5) {
            //     this.samsaraCount += 10;
            // }

            let av = this._bufferFrameCycle.reduce((pre, cur) => pre + cur) / 30;
            if (av < 18) {
                this.samsaraCount += 5;
            }
            if (av > 18) {
                this.samsaraCount = 1 + this.samsaraCount * 0.8;
            }
            // this.entities.map(entity => {
            //     entity.vx *= oldSam / this.samsaraCount;
            // })

            // console.log('每帧', oldSam, '个轮回');
            // console.log('用时', endTime - this._frameTimestamp, '毫秒');
            // console.log('帧周期', frameCycle, '毫秒');
            // console.log('调频: ', this.samsaraCount);
            // console.log('---------------------------');
        }

        this._bufferFunCycle[this._autoFreqTimmer] = endTime - this._frameTimestamp;
        this._bufferFrameCycle[this._autoFreqTimmer] = frameCycle;
        this._autoFreqTimmer += 1;
    }

    // 平衡模式
    if (this.autoFreqMode === 'balance') {
        let vMax = this.entities.reduce((pre, cur) => {
            let approximateV = Math.sqrt(Math.pow(cur.v.x, 2) + Math.pow(cur.v.y, 2));
            if (approximateV > pre) {
                return approximateV
            } else {return pre}
        }, 0.5)
        this.samsaraCount =  Math.floor(vMax * 2);
        // console.log(this.samsaraCount);
    }
}


export {
    getID,
    autoFreq,
}
