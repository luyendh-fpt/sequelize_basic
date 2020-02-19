const express = require('express');
const app = express();
const port = 8888;

// Khai báo kết nối đến database.
const Sequelize = require('sequelize');
// kèm các thông tin tên database, tài khoản, mật khẩu, ip server.
const sequelize = new Sequelize('database_name', 'account', 'password', {
    host: 'server_ip',
    dialect: 'mssql'
});

// test connection, có thể bỏ phần này cho bớt rắc rối.
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
// end of test connection.

// Khai báo class User extent từ Sequelize.Model
const Model = Sequelize.Model;

class User extends Model {
}

// Khai báo các thuộc tính cùng kiểu dữ liệu cũng như
// bảng mapping trong database.
User.init({
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }
}, {
    sequelize, // kết nối database khai báo ở trên.
    modelName: 'user' // tên bảng tự động thêm s thành 'users'
});

// Insert đối tượng user vào database.
app.get('/create-user', function (req, resp) {
    User.create({firstName: 'Aptech', lastName: "FPT"}).then(obj => {
        resp.send('Auto-generated ID:' + obj.id);
    });
})

// Lấy danh sách bản ghi trong bảng users.
// Trả về client theo định dạng json.
app.get('/list-user', function (req, resp) {
    User.findAll().then(users => {
        resp.send(JSON.stringify(users));
    });
})

// Lấy thông tin của user theo id truyền vào trong route parameter.
app.get('/user/:userId', function (req, resp) {
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        resp.send(JSON.stringify(user));
    });
})

// Update thông tin của user theo id truyền vào trong route parameter.
app.get('/update-user/:userId', function (req, resp) {
    User.update({ lastName: "New name" }, {
        where: {
            id: req.params.userId
        }
    }).then(() => {
        resp.send('Success');
    });
})

// Xoá thông tin của user theo id truyền vào trong route parameter.
app.get('/delete-user/:userId', function (req, resp) {
    User.destroy({
        where: {
            id: req.params.userId
        }
    }).then(() => {
        resp.send('Success');
    });
})

app.listen(port, function () {
    console.log('Listening on port ' + port);
})
