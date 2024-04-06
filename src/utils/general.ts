// Response for list
const jsonAll = function<Res>(res: any, status: number, data: Res | Array<Res>, meta: object = {}) {
    return res.status(status).json({
        data: data,
        meta: {...meta,},
    });
};

// Response for details
const jsonOne = function<Res>(res: any, status: number, data: Res) {
    return res.status(status).json({
        data: data
    });
};

export { jsonAll, jsonOne };
