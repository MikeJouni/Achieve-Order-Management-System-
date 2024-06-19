var Sequelize = require('sequelize');

var activityModel = require("./models/activity");
var adminModel = require("./models/admin");
var categoryModel = require("./models/category");
var cmsPageModel = require("./models/cms-page");
var collectedPaymentModel = require("./models/collected-payment");
var companyModel = require("./models/company");
var contactUsModel = require("./models/contact-us");
var customVariableModel = require("./models/custom-variable");
var customerModel = require("./models/customer");
var customerDebtModel = require("./models/customer-debt");
var driverModel = require("./models/driver");
var employeeModel = require("./models/employee");
var faqModel = require("./models/faq");
var favoriteStockModel = require("./models/favorite-stock");
var noteReminderModel = require("./models/note-reminder");
var orderItemModel = require("./models/order-item");
var orderModel = require("./models/order");
var sliderModel = require("./models/slider");
var stockModel = require("./models/stock");
var storePaymentModel = require("./models/store-payment");


// Database
const sequelize = new Sequelize("achieve_oms", "root", "", {
    // const sequelize = new Sequelize("achieve_oms", "root", "oms@phpmyadmin.nls", {
    host: "localhost",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});


// Models

const Activity = activityModel(sequelize, Sequelize);
const Admin = adminModel(sequelize, Sequelize);
const Category = categoryModel(sequelize, Sequelize);
const CmsPage = cmsPageModel(sequelize, Sequelize);
const CollectedPayment = collectedPaymentModel(sequelize, Sequelize);
const Company = companyModel(sequelize, Sequelize);
const ContactUs = contactUsModel(sequelize, Sequelize);
const CustomVariable = customVariableModel(sequelize, Sequelize);
const Customer = customerModel(sequelize, Sequelize);
const CustomerDebt = customerDebtModel(sequelize, Sequelize);
const Driver = driverModel(sequelize, Sequelize);
const Employee = employeeModel(sequelize, Sequelize);
const Faq = faqModel(sequelize, Sequelize);
const FavoriteStock = favoriteStockModel(sequelize, Sequelize);
const NoteReminder = noteReminderModel(sequelize, Sequelize);
const OrderItem = orderItemModel(sequelize, Sequelize);
const Order = orderModel(sequelize, Sequelize);
const Slider = sliderModel(sequelize, Sequelize);
const Stock = stockModel(sequelize, Sequelize);
const StorePayment = storePaymentModel(sequelize, Sequelize);


// =====================
// Relations

// Activity
Activity.belongsTo(Company);
Company.hasMany(Activity);

Activity.belongsTo(CollectedPayment);
CollectedPayment.hasMany(Activity);
Activity.belongsTo(Customer);
Customer.hasMany(Activity);
Activity.belongsTo(CustomerDebt);
CustomerDebt.hasMany(Activity);
Activity.belongsTo(Driver);
Driver.hasMany(Activity);
Activity.belongsTo(Employee);
Employee.hasMany(Activity);
Activity.belongsTo(Order);
Order.hasMany(Activity);
Activity.belongsTo(Stock);
Stock.hasMany(Activity);
Activity.belongsTo(StorePayment);
StorePayment.hasMany(Activity);

// Category
Category.belongsTo(Company);
Company.hasMany(Category);

// CmsPage
CmsPage.belongsTo(Company);
Company.hasMany(CmsPage);

// CollectedPayment
CollectedPayment.belongsTo(Company);
Company.hasMany(CollectedPayment);

// Company
Company.belongsTo(Admin);
Admin.hasMany(Company);

// ContactUs
ContactUs.belongsTo(Company);
Company.hasMany(ContactUs);

// Customer
Customer.belongsTo(Company);
Company.hasMany(Customer);

// CustomerDebt
CustomerDebt.belongsTo(Company);
Company.hasMany(CustomerDebt);
CustomerDebt.belongsTo(Customer);
Customer.hasMany(CustomerDebt);
CustomerDebt.belongsTo(Order);
Order.hasMany(CustomerDebt);

// Driver
Driver.belongsTo(Company);
Company.hasMany(Driver);

// Employee
Employee.belongsTo(Company);
Company.hasMany(Employee);

// Faq
Faq.belongsTo(Company);
Company.hasMany(Faq);

// FavoriteStock
FavoriteStock.belongsTo(Stock);
Stock.hasMany(FavoriteStock);
FavoriteStock.belongsTo(Customer);
Customer.hasMany(FavoriteStock);

// NoteReminder
NoteReminder.belongsTo(Company);
Company.hasMany(NoteReminder);

// Order Item
OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Stock);
Stock.hasMany(OrderItem);

// Order
Order.belongsTo(Company);
Company.hasMany(Order);
Order.belongsTo(Customer);
Customer.hasMany(Order);
Order.belongsTo(Driver);
Driver.hasMany(Order);

// Slider
Slider.belongsTo(Company);
Company.hasMany(Slider);

// Stock
Stock.belongsTo(Company);
Company.hasMany(Stock);
Stock.belongsTo(Category);
Category.hasMany(Stock);

// StorePayment
StorePayment.belongsTo(Company);
Company.hasMany(StorePayment);


async function syncDatabaseTables() {
    await sequelize.sync({ alter: true }).then(() => {
        console.log(`Database & tables created!`);
    });
}

// syncDatabaseTables(); //! Uncomment to sync tables


module.exports = {
    Activity,
    Admin,
    Category,
    CmsPage,
    CollectedPayment,
    Company,
    ContactUs,
    CustomVariable,
    CustomerDebt,
    Customer,
    Driver,
    Employee,
    Faq,
    FavoriteStock,
    NoteReminder,
    OrderItem,
    Order,
    Slider,
    Stock,
    StorePayment,
    syncDatabaseTables,
}