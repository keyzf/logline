import LoggerInterface from './interface';
import * as util from '../lib/util';

export default class LocalStorageLogger extends LoggerInterface {
    constructor(...args) {
        super(...args);
    }

    _record(level, descriptor, data) {
        var logs = window.localStorage.getItem('logline') ? JSON.parse(window.localStorage.getItem('logline')) : [];
        logs.push({
            time: Date.now(),
            namespace: this._namesapce,
            level: level,
            descriptor: descriptor,
            data: data
        });
        try {
            window.localStorage.setItem('logline', JSON.stringify(logs));
        } catch (e) { util.throwError('error inserting record'); }
    }

    static init() {
        if (!LocalStorageLogger.support) {
            util.throwError('your platform does not support localstorage protocol.');
        }
        if (!window.localStorage.getItem('logline')) {
            window.localStorage.setItem('logline', JSON.stringify([]));
        }
        LocalStorageLogger.status = super.STATUS.INITED;
    }

    static all(readyFn) {
        readyFn(JSON.parse(window.localStorage.getItem('logline')));
    }

    static keep(daysToMaintain) {
        var logs = !daysToMaintain ? [] : (window.localStorage.getItem('logline') ? JSON.parse(window.localStorage.getItem('logline')) : []).filter(log => {
            return log.time >= (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
        });
        window.localStorage.setItem('logline', JSON.stringify(logs));
    }

    static clean() {
        window.localStorage.removeItem('logline');
    }
}

LoggerInterface.support = 'localStorage' in window;
