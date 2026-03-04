// Base44 Client SDK (Mock implementation based on requirements)

const mockList = (entity, order, limit) => {
    return Promise.resolve([]);
};

const mockFilter = (entity, filter, order, limit) => {
    return Promise.resolve([]);
};

const mockCreate = (entity, data) => {
    console.log(`Creating ${entity}:`, data);
    return Promise.resolve({ id: Math.random().toString(36).substr(2, 9), ...data });
};

const mockUpdate = (entity, id, data) => {
    console.log(`Updating ${entity} ${id}:`, data);
    return Promise.resolve({ id, ...data });
};

const mockDelete = (entity, id) => {
    console.log(`Deleting ${entity} ${id}`);
    return Promise.resolve({ success: true });
};

export const base44 = {
    auth: {
        me: () => {
            const user = localStorage.getItem('agrilink_user');
            if (!user) return Promise.resolve(null);
            return Promise.resolve(JSON.parse(user));
        },
        login: (email, password) => {
            const user = {
                email: email || "user@example.com",
                full_name: "Test User",
                role: "Farmer",
                profile_image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            };
            localStorage.setItem('agrilink_user', JSON.stringify(user));
            return Promise.resolve(user);
        },
        logout: () => {
            localStorage.removeItem('agrilink_user');
            return Promise.resolve({});
        },
    },
    entities: {
        Land: {
            list: (order, limit) => mockList("Land", order, limit),
            filter: (filter, order, limit) => mockFilter("Land", filter, order, limit),
            create: (data) => mockCreate("Land", data),
            update: (id, data) => mockUpdate("Land", id, data),
            delete: (id) => mockDelete("Land", id),
            get: (id) => Promise.resolve({ id, title: "Sample Land" }),
        },
        Equipment: {
            list: (order, limit) => mockList("Equipment", order, limit),
            filter: (filter, order, limit) => mockFilter("Equipment", filter, order, limit),
            create: (data) => mockCreate("Equipment", data),
            update: (id, data) => mockUpdate("Equipment", id, data),
            delete: (id) => mockDelete("Equipment", id),
        },
        Worker: {
            list: (order, limit) => mockList("Worker", order, limit),
            filter: (filter, order, limit) => mockFilter("Worker", filter, order, limit),
            create: (data) => mockCreate("Worker", data),
            update: (id, data) => mockUpdate("Worker", id, data),
            delete: (id) => mockDelete("Worker", id),
        },
        Booking: {
            list: (order, limit) => mockList("Booking", order, limit),
            filter: (filter, order, limit) => mockFilter("Booking", filter, order, limit),
            create: (data) => mockCreate("Booking", data),
            update: (id, data) => mockUpdate("Booking", id, data),
            delete: (id) => mockDelete("Booking", id),
        },
        Review: {
            list: (order, limit) => mockList("Review", order, limit),
            filter: (filter, order, limit) => mockFilter("Review", filter, order, limit),
            create: (data) => mockCreate("Review", data),
        },
        Message: {
            list: (order, limit) => mockList("Message", order, limit),
            filter: (filter, order, limit) => mockFilter("Message", filter, order, limit),
            create: (data) => mockCreate("Message", data),
        },
        Transport: {
            list: (order, limit) => mockList("Transport", order, limit),
            filter: (filter, order, limit) => mockFilter("Transport", filter, order, limit),
            create: (data) => mockCreate("Transport", data),
            update: (id, data) => mockUpdate("Transport", id, data),
            delete: (id) => mockDelete("Transport", id),
        },
    },
    integrations: {
        Core: {
            InvokeLLM: async ({ prompt, response_json_schema, add_context_from_internet }) => {
                console.log("Invoking LLM with prompt:", prompt);
                // Simulate LLM response
                return {
                    answer: "This is a simulated AI response for agricultural advice.",
                    data: {}
                };
            },
            UploadFile: async (file) => {
                console.log("Uploading file:", file.name);
                return { url: "https://via.placeholder.com/400" };
            }
        }
    }
};
