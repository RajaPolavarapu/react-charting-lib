function generateRandomData(numItems) {
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const variables = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', "v9"];

    const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const createRandomDataObject = () => {
        return {
            group: groups[Math.floor(Math.random() * groups.length)],
            variable: variables[Math.floor(Math.random() * variables.length)],
            value: getRandomValue(0, 100)
        };
    };

    const randomData = Array.from({ length: numItems }, createRandomDataObject);

    return randomData;
}

export default generateRandomData(300);