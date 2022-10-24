# `SELL-WATCHES`
This project is a graduate essay. It helps me to practice my coding skill and relationship diagram.  

### `About client side`
### Features
`customer page`
- Payment online with MOMO
- Order product without auth
- Search, filter product quickly
- Get voucher free when an event happens
- Use voucher when payment
- Feed back about product (vote and comment)
- View history order, cancle order
- Add product to wish list
- Add, edit cart
- Forget password
- Login account, register new account
- Login with social media ( facebook, google )
- Auto calculate fee ship with Giao Hang Nhanh Express

`admin page`
- Manage many modules of website (product, category, position, vouchers, employee ...)
- View top product selling
- Revenue statistics for today, week, month, quarter, year
- View newest orders
- Role employee
- Block / unclock user account
- Reply, delete users feedback
- Confirm orders
- Give vouchers for all user, group user via email

##### `Demo client` https://sell-watches.surge.sh/
#
#
### `About server side`
### Technology
- Json web token for Auth
- ExpressJS
- Mysql
- Cloudinary for storage files
- Node-mailler

### [solved] Deploy to heroku when sever and client in same folder 
- heroku buildpacks:clear
- heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
- heroku buildpacks:add heroku/nodejs
- heroku config:set PROJECT_PATH=projects/nodejs/frontend

##### `Demo server` http://localhost:8000/api/