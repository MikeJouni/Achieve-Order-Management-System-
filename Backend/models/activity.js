const { DataTypes } = require("sequelize");

const ActivityModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    messageEn: DataTypes.TEXT,
    messageAr: DataTypes.TEXT,
    type: {
        type: DataTypes.ENUM,
        values: [
            'admin-created-customer',   // companyId, customerId, employeeId==null --- Admin John created customer Smith.
            'admin-created-employee',   // companyId, employeeId, employeeId==null --- Admin John created employee Smith.
            'admin-created-stock',   // companyId, stockId, employeeId==null --- Admin John created stock Steel Bar.
            'admin-updated-stock',   // companyId, stockId, employeeId==null --- Admin John updated stock Steel Bar.
            'admin-created-driver',   // companyId, driverId, employeeId==null --- Admin John created driver Smith.
            'admin-created-order',   // companyId, orderId, employeeId==null, customerId --- Admin John created order #AB1234 for customer Smith.
            'admin-updated-order-in-progress', // companyId, orderId, employeeId==null --- Admin John updated order #AB1234 status to In Progress.
            'admin-updated-order-completed',  // companyId, orderId, employeeId==null --- Admin John updated order #AB1234 status to Completed.
            'admin-updated-order-cancelled',  // companyId, orderId, employeeId==null --- Admin John updated order #AB1234 status to Cancelled.
            'admin-deleted-order',  // companyId, orderId, employeeId==null --- Admin John deleted order #AB1234.
            'admin-created-store-payment',   // companyId, storePaymentId --- Admin John created store payment with Paid amount 1000.
            'admin-updated-store-payment', // companyId, storePaymentId --- Admin John updated store payment with Unpaid amount 1000.
            'admin-deleted-store-payment',  // companyId, storePaymentId --- Admin John deleted store payment with Paid amount 1000.
            'admin-created-collected-payment',   // companyId, collectedPaymentId --- Admin John created collected payment with amount 1000 for date 2023-01-01.
            'admin-updated-collected-payment', // companyId, collectedPaymentId --- Admin John updated collected payment with amount 1000 for date 2023-01-01.
            'admin-deleted-collected-payment',  // companyId, collectedPaymentId --- Admin John deleted collected payment with amount 1000 for date 2023-01-01.
            'admin-created-customer-debt', // companyId, customerId, employeeId==null --- Admin John created customer debt of amount 1000 for customer Smith.
            'admin-updated-customer-debt', // companyId, customerId, employeeId==null --- Admin John updated customer debt of amount 1000 for customer Smith.
            'admin-deleted-customer-debt', // companyId, customerId, employeeId==null --- Admin John deleted customer debt of amount 1000 for customer Smith.

            'employee-created-customer',   // employeeId, customerId --- Employee John created customer Smith.
            'employee-created-order',   // employeeId, orderId, customerId --- Employee John created order #AB1234 for customer Smith.
            'employee-created-stock',   // employeeId, stockId --- Employee John created stock Steel Bar.
            'employee-updated-stock',   // employeeId, stockId --- Employee John updated stock Steel Bar.
            'employee-created-driver',   // employeeId, driverId --- Employee John created driver Smith.
            'employee-updated-order-in-progress', // employeeId, orderId --- Employee John updated order #AB1234 status to In Progress.
            'employee-updated-order-completed',  // employeeId, orderId --- Employee John updated order #AB1234 status to Completed.
            'employee-updated-order-cancelled',  // employeeId, orderId --- Employee John updated order #AB1234 status to Cancelled.
            'employee-deleted-order',  // employeeId, orderId --- Employee John deleted order #AB1234.
            'employee-created-customer-debt', // companyId, customerId, employeeId --- Employee John created customer debt of amount 1000 for customer Smith.
            'employee-updated-customer-debt', // companyId, customerId, employeeId --- Employee John updated customer debt of amount 1000 for customer Smith.
            'employee-deleted-customer-debt', // companyId, customerId, employeeId --- Employee John deleted customer debt of amount 1000 for customer Smith.

            'customer-debt-created-for-order', // orderId, employeeId==null --- Customer debt of amount 1000 for order #ABC1234 and customer Smith.
        ]
    }
};

module.exports = (sequelize) => {
    return sequelize.define("activity", ActivityModel);
};

// Foreign Keys
