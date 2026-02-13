import Business from "../models/business.model.ts";
import routesUtil from "../util/routesUtil.ts";

export default {
    async create(req, res) {
        const businessInfo = req.body;

        console.log(
            `Creating business with info: ${JSON.stringify(businessInfo)}.`,
        );

        await Business.create(businessInfo)
            .then((data) => {
                routesUtil.success(res, "Successfully created business.", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating business: ${err}`);
            });
    },
    async update(req, res) {
        const businessInfo = req.body;

        console.log(
            `Updating ability with info: ${JSON.stringify(businessInfo)}.`,
        );

        await Business.upsert(businessInfo, { returning: true })
            .then((result) => {
                routesUtil.success(
                    res,
                    "Successfully updated business.",
                    result[0],
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error updating business: ${err}`);
            });
    },
    async delete(req, res) {
        const id = req.params.id;

        console.log(`Deleting business: ${id}.`);

        await Business.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted business.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting business: ${err}`);
            });
    },
    async find(req, res) {
        const id = req.params.id;

        console.log(`Finding business: ${id}.`);

        await Business.findByPk(id)
            .then((business) => {
                routesUtil.success(
                    res,
                    `Successfully found ability: ${JSON.stringify(business)}.`,
                    business,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding business: ${err}`);
            });
    },
};
