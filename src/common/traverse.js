/**
 * 遍历关系
 */

/**
 * 两组实体之间的关系(实体组内部无关系)
 * 链式调用: between([arrayOfBase, Base], [Base]).when((A, B)=>{if...}).do((A, B)=>{do...})
 * @method between
 * @param  {Array(Array|Base)} setsA
 * @param  {Array(Array|Base)} setsB
 */
function between(setsA, setsB) {
    let entitiesA = setsA.reduce((a, b) => a.concat(b), []);
    let entitiesB = setsB.reduce((a, b) => a.concat(b), []);
    return {
        do: (funcDo) => {
            _travBetween(entitiesA, entitiesB, funcDo);
        },
        when: (funcWhen) => {
            return {
                do: (funcDo) => {
                    _travBetween(entitiesA, entitiesB, (A, B) => {
                        if (funcWhen(A, B)) {
                            funcDo(A, B);
                        }
                    });
                }
            }
        }
    }
}
/**
 * 实体之间的关系
 * @method among
 * @param  {Array(Base)|Base} ...sets
 */
function among(...sets) {
    let entities = sets.reduce((a, b) => a.concat(b));
    return {
        do: (funcDo) => {
            _travAmong(entities, funcDo);
        },
        when: (funcWhen) => {
            return {
                do: (funcDo) => {
                    _travAmong(entities, (A, B) => {
                        if (funcWhen(A, B)) {
                            funcDo(A, B);
                        }
                    });
                }
            }
        }
    }
}


function _travBetween(entitiesA, entitiesB, func) {
    for (let i = 0; i < entitiesA.length; i++) {
        let entity = entitiesA[i];
        for (let j = 0; j < entitiesB.length; j++) {
            let nextEntity = entitiesB[j];
            func(entity, nextEntity);
        }
    }
}

function _travAmong(entities, func) {
    for (let i = 0; i < entities.length - 1; i++) {
        let entity = entities[i];
        for (let j = i + 1; j < entities.length; j++) {
            let nextEntity = entities[j];
            func(entity, nextEntity);
        }
    }
}


export {
    between,
    among
};
