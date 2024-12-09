class Array_Generator {
    static generate_array(class_instance, obj) {
        const { total } = class_instance;
        const data_array = Array(total).fill('');
        for (const [property, i] of Object.entries(class_instance)) {
            if (obj[property] !== undefined) {
                data_array[i] = obj[property];
            }
        }
        return data_array;
    }
}

export { Array_Generator };