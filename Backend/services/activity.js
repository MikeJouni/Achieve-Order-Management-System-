const { Activity, Employee, Customer, Stock, Order, Driver, Admin, Company, StorePayment, CollectedPayment, CustomerDebt } = require("../database");

function paymentSymbolReturn(amountType) {
    result = ''
    if (amountType == 'dollar') {
        result = '$';
    } else if (amountType == 'lebanese') {
        result = 'L.L';
    } else if (amountType == 'euro') {
        result = '€';
    }
    return result;
}

async function createActivity(data) {
    const collectedPaymentId = data.collectedPaymentId ?? null;
    const companyId = data.companyId ?? null;
    const customerId = data.customerId ?? null;
    const customerDebtId = data.customerDebtId ?? null;
    const driverId = data.driverId ?? null;
    const employeeId = data.employeeId ?? null;
    const orderId = data.orderId ?? null;
    const stockId = data.stockId ?? null;
    const storePaymentId = data.storePaymentId ?? null;
    const type = data.type ?? null;

    var adminName = '';
    var employeeName = '';
    var customerName = '';
    var driverName = '';
    var stockTitle = '';
    var orderUniqueId = '';
    var storePaymentData = {
        amount: null,
        isPaid: null,
    }
    var collectedPaymentData = {
        amount: null,
        amountType: null,
        date: null,
    }
    var customerDebtData = {
        amount: null,
    }

    var activityMessageEn = '';
    var activityMessageAr = '';

    if (companyId && !employeeId) {
        const company = await Company.findOne({
            where: {
                id: companyId,
            },
            attributes: ['adminId'],
            include: {
                model: Admin,
                attributes: ['name'],
            }
        });
        adminName = company.admin.name;
    }

    if (employeeId) {
        const employee = await Employee.findOne({
            where: {
                id: employeeId,
            },
            attributes: ['name'],
        });
        employeeName = employee.name;
    }

    if (customerId) {
        const customer = await Customer.findOne({
            where: {
                id: customerId,
            },
            attributes: ['name'],
        });
        customerName = customer.name;
    }

    if (driverId) {
        const driver = await Driver.findOne({
            where: {
                id: driverId,
            },
            attributes: ['name'],
        });
        driverName = driver.name;
    }

    if (stockId) {
        const stock = await Stock.findOne({
            where: {
                id: stockId,
            },
            attributes: ['title'],
        });
        stockTitle = stock.title;
    }

    if (orderId) {
        const order = await Order.findOne({
            where: {
                id: orderId,
            },
            attributes: ['uniqueId'],
        });
        orderUniqueId = order.uniqueId;
    }

    if (storePaymentId) {
        storePaymentData = await StorePayment.findOne({
            where: {
                id: storePaymentId,
            },
            attributes: ['amount', 'isPaid'],
        });
    }

    if (collectedPaymentId) {
        collectedPaymentData = await CollectedPayment.findOne({
            where: {
                id: collectedPaymentId,
            },
            attributes: ['amount', 'amountType', 'date'],
        });
    }

    if (customerDebtId) {
        customerDebtData = await CustomerDebt.findOne({
            where: {
                id: customerDebtId,
            },
            attributes: ['amount'],
        });
    }


    if (type == 'customer-debt-created-for-order') {
        // customerDebtId
        activityMessageEn = `Customer debt of amount ${customerDebtData.amount} created for order #${orderUniqueId} and customer ${customerName}.`;
        activityMessageAr = `دين العميل بالمبلغ ${customerDebtData.amount} خلقت لأجل #${orderUniqueId} والعميل ${customerName}.`;
    }
    else if (adminName) {

        // Admin Activities
        if (type == 'admin-created-customer') {
            // customerId, employeeId == null
            activityMessageEn = `Admin ${adminName} created customer ${customerName}.`;
            activityMessageAr = `مسؤل ${adminName} العميل الذي تم إنشاؤه ${customerName}.`;
        } else if (type == 'admin-created-driver') {
            // driverId, employeeId == null
            activityMessageEn = `Admin ${adminName} created driver ${driverName}.`;
            activityMessageAr = `مسؤل ${adminName} خلق السائق ${driverName}.`;
        }
        //  else if (type == 'admin-created-employee') {
        //     // employeeId
        //     activityMessage = `Admin ${adminName} created employee ${employeeName}.`;
        // } 
        else if (type == 'admin-created-stock') {
            // stockId, employeeId == null
            activityMessageEn = `Admin ${adminName} created stock ${stockTitle}.`;
            activityMessageAr = `مسؤل ${adminName} خلق المخزون ${stockTitle}.`;
        } else if (type == 'admin-updated-stock') {
            // stockId, employeeId == null
            activityMessageEn = `Admin ${adminName} updated stock ${stockTitle}.`;
            activityMessageAr = `مسؤل ${adminName} تحديث المخزون ${stockTitle}.`;
        } else if (type == 'admin-created-order') {
            // orderId, customerId, employeeId == null
            activityMessageEn = `Admin ${adminName} created order #${orderUniqueId} for customer ${customerName}.`;
            activityMessageAr = `مسؤل ${adminName} النظام الذي تم إنشاؤه #${orderUniqueId} للزبون ${customerName}.`;
        } else if (type == 'admin-updated-order-in-progress') {
            // orderId, employeeId == null
            activityMessageEn = `Admin ${adminName} updated order #${orderUniqueId} status to In Progress.`;
            activityMessageAr = `مسؤل ${adminName} طلب محدث #${orderUniqueId} الحالة قيد التقدم.`;
        } else if (type == 'admin-updated-order-completed') {
            // orderId, employeeId == null
            activityMessageEn = `Admin ${adminName} updated order #${orderUniqueId} status to Completed.`;
            activityMessageAr = `مسؤل ${adminName} طلب محدث #${orderUniqueId} الحالة مكتملة.`;
        } else if (type == 'admin-updated-order-cancelled') {
            // orderId, employeeId == null
            activityMessageEn = `Admin ${adminName} updated order #${orderUniqueId} status to Cancelled.`;
            activityMessageAr = `مسؤل ${adminName} طلب محدث #${orderUniqueId} الوضع ملغى.`;
        } else if (type == 'admin-deleted-order') {
            // orderId, employeeId == null
            activityMessageEn = `Admin ${adminName} deleted order #${orderUniqueId}.`;
            activityMessageAr = `مسؤل ${adminName} طلب محذوف #${orderUniqueId}.`;
        }
        else if (type == 'admin-created-store-payment') {
            // storePaymentId
            activityMessageEn = `Admin ${adminName} created store payment with ${storePaymentData.isPaid ? 'Paid' : 'Unpaid'} amount ${storePaymentData.amount}.`;
            activityMessageAr = `مسؤل ${adminName} إنشاء دفع المتجر مع ${storePaymentData.isPaid ? 'مدفوع' : 'غير مدفوعة'} كمية ${storePaymentData.amount}.`;
        } else if (type == 'admin-updated-store-payment') {
            // storePaymentId
            activityMessageEn = `Admin ${adminName} updated store payment with ${storePaymentData.isPaid ? 'Paid' : 'Unpaid'} amount ${storePaymentData.amount}.`;
            activityMessageAr = `مسؤل ${adminName} تحديث دفع المتجر مع ${storePaymentData.isPaid ? 'مدفوع' : 'غير مدفوعة'} كمية ${storePaymentData.amount}.`;
        } else if (type == 'admin-deleted-store-payment') {
            // storePaymentId
            activityMessageEn = `Admin ${adminName} deleted store payment with ${storePaymentData.isPaid ? 'Paid' : 'Unpaid'} amount ${storePaymentData.amount}.`;
            activityMessageAr = `مسؤل ${adminName} دفع المتجر المحذوف باستخدام ${storePaymentData.isPaid ? 'مدفوع' : 'غير مدفوعة'} كمية ${storePaymentData.amount}.`;
        }
        else if (type == 'admin-created-collected-payment') {
            // collectedPaymentId
            activityMessageEn = `Admin ${adminName} created collected payment with amount ${paymentSymbolReturn(collectedPaymentData.amountType)} ${collectedPaymentData.amount} for date ${collectedPaymentData.date}.`;
            activityMessageAr = `مسؤل ${adminName} إنشاء دفعة مجمعة بالمبلغ ${paymentSymbolReturn(collectedPaymentData.amountType)} ${collectedPaymentData.amount} للتاريخ ${collectedPaymentData.date}.`;
        } else if (type == 'admin-updated-collected-payment') {
            // collectedPaymentId
            activityMessageEn = `Admin ${adminName} updated collected payment with amount ${paymentSymbolReturn(collectedPaymentData.amountType)} ${collectedPaymentData.amount} for date ${collectedPaymentData.date}.`;
            activityMessageAr = `مسؤل ${adminName} تم تحديث الدفعة المجمعة بالمبلغ ${paymentSymbolReturn(collectedPaymentData.amountType)} ${collectedPaymentData.amount} للتاريخ ${collectedPaymentData.date}.`;
        } else if (type == 'admin-deleted-collected-payment') {
            // collectedPaymentId
            activityMessageEn = `Admin ${adminName} deleted collected payment with amount ${paymentSymbolReturn(collectedPaymentData.amountType)} ${collectedPaymentData.amount} for date ${collectedPaymentData.date}.`;
            activityMessageAr = `مسؤل ${adminName} تم حذف الدفعة المجمعة بالمبلغ ${paymentSymbolReturn(collectedPaymentData.amountType)} ${collectedPaymentData.amount} للتاريخ ${collectedPaymentData.date}.`;
        }
        else if (type == 'admin-created-customer-debt') {
            // customerDebtId
            activityMessageEn = `Admin ${adminName} created customer debt of amount ${customerDebtData.amount} for customer ${customerName}.`;
            activityMessageAr = `مسؤل ${adminName} خلق دين العميل من المبلغ ${customerDebtData.amount} للزبون ${customerName}.`;
        } else if (type == 'admin-updated-customer-debt') {
            // customerDebtId
            activityMessageEn = `Admin ${adminName} updated customer debt of amount ${customerDebtData.amount} for customer ${customerName}.`;
            activityMessageAr = `مسؤل ${adminName} دين العميل المحدث من المبلغ ${customerDebtData.amount} للزبون ${customerName}.`;
        } else if (type == 'admin-deleted-customer-debt') {
            // customerDebtId
            activityMessageEn = `Admin ${adminName} deleted customer debt of amount ${customerDebtData.amount} for customer ${customerName}.`;
            activityMessageAr = `مسؤل ${adminName} حذف ديون العميل من المبلغ ${customerDebtData.amount} للزبون ${customerName}.`;
        }

    } else if (employeeName) {

        // Employee Activities
        if (type == 'employee-created-customer') {
            // employeeId, customerId
            activityMessageEn = `Employee ${employeeName} created customer ${customerName}.`;
            activityMessageAr = `موظف ${employeeName} العميل الذي تم إنشاؤه ${customerName}.`;
        } else if (type == 'employee-created-driver') {
            // employeeId, driverId
            activityMessageEn = `Employee ${employeeName} created driver ${driverName}.`;
            activityMessageAr = `موظف ${employeeName} خلق السائق ${driverName}.`;
        } else if (type == 'employee-created-stock') {
            // employeeId, stockId
            activityMessageEn = `Employee ${employeeName} created stock ${stockTitle}.`;
            activityMessageAr = `موظف ${employeeName} خلق المخزون ${stockTitle}.`;
        } else if (type == 'employee-updated-stock') {
            // employeeId, stockId
            activityMessageEn = `Employee ${employeeName} updated stock ${stockTitle}.`;
            activityMessageAr = `موظف ${employeeName} تحديث المخزون ${stockTitle}.`;
        } else if (type == 'employee-created-order') {
            // employeeId, orderId, customerId
            activityMessageEn = `Employee ${employeeName} created order #${orderUniqueId} for customer ${customerName}.`;
            activityMessageAr = `موظف ${employeeName} النظام الذي تم إنشاؤه #${orderUniqueId} for customer ${customerName}.`;
        } else if (type == 'employee-updated-order-in-progress') {
            // employeeId, orderId
            activityMessageEn = `Employee ${employeeName} updated order #${orderUniqueId} status to In Progress.`;
            activityMessageAr = `موظف ${employeeName} طلب محدث #${orderUniqueId} status to In Progress.`;
        } else if (type == 'employee-updated-order-completed') {
            // employeeId, orderId
            activityMessageEn = `Employee ${employeeName} updated order #${orderUniqueId} status to Completed.`;
            activityMessageAr = `موظف ${employeeName} طلب محدث #${orderUniqueId} status to Completed.`;
        } else if (type == 'employee-updated-order-cancelled') {
            // employeeId, orderId
            activityMessageEn = `Employee ${employeeName} updated order #${orderUniqueId} status to Cancelled.`;
            activityMessageAr = `موظف ${employeeName} طلب محدث #${orderUniqueId} status to Cancelled.`;
        } else if (type == 'employee-deleted-order') {
            // employeeId, orderId
            activityMessageEn = `Employee ${employeeName} deleted order #${orderUniqueId}.`;
            activityMessageAr = `موظف ${employeeName} طلب محذوف #${orderUniqueId}.`;
        }
        else if (type == 'employee-created-customer-debt') {
            // customerDebtId
            activityMessageEn = `Employee ${employeeName} created customer debt of amount ${customerDebtData.amount} for customer ${customerName}.`;
            activityMessageAr = `موظف ${employeeName} خلق دين العميل من المبلغ ${customerDebtData.amount} للزبون ${customerName}.`;
        } else if (type == 'employee-updated-customer-debt') {
            // customerDebtId
            activityMessageEn = `Employee ${employeeName} updated customer debt of amount ${customerDebtData.amount} for customer ${customerName}.`;
            activityMessageAr = `موظف ${employeeName} دين العميل المحدث من المبلغ ${customerDebtData.amount} للزبون ${customerName}.`;
        } else if (type == 'employee-deleted-customer-debt') {
            // customerDebtId
            activityMessageEn = `Employee ${employeeName} deleted customer debt of amount ${customerDebtData.amount} for customer ${customerName}.`;
            activityMessageAr = `موظف ${employeeName} حذف ديون العميل من المبلغ ${customerDebtData.amount} للزبون ${customerName}.`;
        }

    }

    return await Activity.create({
        type: type,
        companyId: companyId,
        
        messageEn: activityMessageEn,
        messageAr: activityMessageAr,
        collectedPaymentId: collectedPaymentId,
        customerId: customerId,
        customerDebtId: customerDebtId,
        driverId: driverId,
        employeeId: employeeId,
        orderId: orderId,
        stockId: stockId,
        storePaymentId: storePaymentId,
    });

}


module.exports = {
    createActivity,
}