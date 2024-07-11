const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    // register
    register: async (req, res, next) => {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}