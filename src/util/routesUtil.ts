export default {
    success(res, message, data) {
        console.log(message);

        if (data == null)
            data = {};

        res.status(200).send(data);
    },
    error(res, message) {
        console.error(message);
        res.status(500).send({ message });
    },
};
