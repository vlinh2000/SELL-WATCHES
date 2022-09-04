function getBreadcrumbFromSecond(path) {
    let paths = [];
    let key = null;

    console.log(path)

    switch (path) {
        case '/admin/employees/edit': {
            paths = ['Quản lý nhân viên', 'Cập nhật nhân viên'];
            key = "221"
            break;
        }
        case '/admin/employees/view': {
            paths = ['Quản lý nhân viên', 'Danh sách nhân viên'];
            key = "222"
            break;
        }
        case '/admin/orders/confirm': {
            paths = ['Quản lý đơn hàng', 'Xác nhận đơn hàng'];
            key = "331"
            break;
        }
        // case '/admin/orders/edit': {
        //     paths = ['Quản lý đơn hàng', 'Cập nhật đơn hàng'];
        //     key = "332"
        //     break;
        // }
        case '/admin/orders/view': {
            paths = ['Quản lý đơn hàng', 'Danh sách đơn hàng'];
            key = "333"
            break;
        }
        case '/admin/products/edit': {
            paths = ['Quản lý sản phẩm', 'Cập nhật sản phẩm'];
            key = "441"
            break;
        }
        case '/admin/products/view': {
            paths = ['Quản lý sản phẩm', 'Danh sách sản phẩm'];
            key = "442"
            break;
        }
        case '/admin/productTypes/edit': {
            paths = ['Quản lý loại sản phẩm', 'Cập nhật loại sản phẩm'];
            key = "991";
            break;
        }
        case '/admin/productTypes/view': {
            paths = ['Quản lý loại sản phẩm', 'Danh sách loại sản phẩm'];
            key = "992";
            break;
        }
        case '/admin/positions/edit': {
            paths = ['Quản lý chức vụ', 'Cập nhật chức vụ'];
            key = "551";
            break;
        }
        case '/admin/positions/view': {
            paths = ['Quản lý chức vụ', 'Danh sách chức vụ'];
            key = "552";
            break;
        }
        case '/admin/receipts/edit': {
            paths = ['Quản lý phiếu nhập kho', 'Cập nhật phiếu nhập kho'];
            key = "661";
            break;
        }
        case '/admin/receipts/view': {
            paths = ['Quản lý phiếu nhập kho', 'Danh sách phiếu nhập kho'];
            key = "662";
            break;
        }
        case '/admin/categories/edit': {
            paths = ['Quản lý danh mục', 'Cập nhật danh mục'];
            key = "771";
            break;
        }
        case '/admin/categories/view': {
            paths = ['Quản lý danh mục', 'Danh sách danh mục'];
            key = "772";
            break;
        }
        case '/admin/brands/edit': {
            paths = ['Quản lý thương hiệu', 'Cập nhật thương hiệu'];
            key = "881";
            break;
        }
        case '/admin/brands/view': {
            paths = ['Quản lý thương hiệu', 'Danh sách thương hiệu'];
            key = "882";
            break;
        }
        case '/admin/users/view': {
            paths = ['Quản lý người dùng', 'Danh sách người dùng'];
            key = "10101";
            break;
        }
        case '/admin/suppliers/edit': {
            paths = ['Quản lý nhà cung cấp', 'Cập nhật nhà cung cấp'];
            key = "11111";
            break;
        }
        case '/admin/suppliers/view': {
            paths = ['Quản lý nhà cung cấp', 'Danh sách nhà cung cấp'];
            key = "11112";
            break;
        }
        case '/admin/rules/edit': {
            paths = ['Quản lý quyền', 'Cập nhật quyền'];
            key = "12121";
            break;
        }
        case '/admin/rules/view': {
            paths = ['Quản lý quyền', 'Danh sách quyền'];
            key = "12122";
            break;
        }
        // case '/admin/vouchers/edit': {
        //     paths = ['Quản lý phiếu giảm giá', 'Cập nhật phiếu giảm giá'];
        //     key = "13131";
        //     break;
        // }
        // case '/admin/vouchers/view': {
        //     paths = ['Quản lý phiếu giảm giá', 'Danh sách phiếu giảm giá'];
        //     key = "13132";
        //     break;
        // }
        case '/admin/dashboard': {
            paths = ['Dashboard'];
            key = "1"
            break;
        }
    }

    return { paths, key };
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getStatusOrder(num) {

    return num == 0 ? 'Chờ xử lý' : num == 1 ? 'Đang giao' : num === 2 ? 'Đã giao' : num == 3 ? 'Đã hủy' : 'Không xác định';

}

function formatDate(date, formart = "YYYY-MM-DD") {
    let dateFormatted;
    switch (date) {
        case 'YYYY-MM-DD': dateFormatted = date.toJSON().slice(0, 10);
    }
    return dateFormatted;
}

export { getBreadcrumbFromSecond, numberWithCommas, getStatusOrder, formatDate };