import { MysqDB } from '../../common/sequelize';

export class Setting {

    static mysql = (tName) => new MysqDB(tName);

    constructor() {

    }

    static Query = {
        getVersionById(parent, { id }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_client_version").findById(id);
        },

        getNewsById(parent, { id }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_news").findById(id);
        },

        getNoticeById(parent, { id }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_notice").findById(id);
        },

        getTipById(parent, { id }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_tip").findById(id);
        }

    }

    static Mutation = {
        updateVersion(parent, { id, version }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_client_version").update(version, id);
        },
        updateNews(parent, { id, news }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_news").update(news, id);
        },
        updateNotice(parent, { id, notice }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_notice").update(notice, id);
        },
        updateTip(parent, { id, tip }, context) {
            if (!context.user) return null;

            return Setting.mysql("t_tip").update(tip, id);
        }
    }
}
