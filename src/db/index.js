const mysql = require('mysql')

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'cinemadb',
})

function login(req, res) {
    const email = req.body.email
    const pass = req.body.pass
    const query = 'select * from account where acc_email = "' + email + '" and acc_password = "' + pass + '"'
    connection.query(query, function (err, result) {
        if (result.length === 1) {
            let user = result[0].acc_username
            res.cookie('user', user)
            res.redirect('/movies')
        } else {
            res.render('login', { message: 'Thông tin đăng nhập của quý khách chưa đúng. Vui lòng đăng nhập lại hoặc dùng chức năng đăng ký!!!'})
        }
    })
}

function logout(req, res) {
    res.clearCookie('user')
    res.redirect('/')
}

function register(req, res) {
    const username = req.body.username
    const email = req.body.email
    const pass = req.body.pass
    const name = req.body.name
    const address = req.body.address
    const phone = req.body.phone
    const dob = req.body.dob

    let query = `select acc_username from account where acc_username = "${username}" union select acc_email from account where acc_email = "${email}"`
    connection.query(query, function (err, result) {
        if (result.length === 0) {
            query = `insert into account values ("${email}", "${pass}", "${username}", now())`
            connection.query(query, function (err, result) {})
            query = `insert into customer values ("${email}", "${name}", "${dob}", "${address}", "${phone}")`
            connection.query(query, function (err, result) {})
            res.render('login', { message: 'Đăng ký thành công!!! Vui lòng đăng nhập để tiếp tục'})
        } 
        else {
            let error = []
            if (result.length === 1) {
                if (result[0].acc_username == username) {
                    error.push('Tên đăng nhập đã có người sử dụng!')
                } else {
                    error.push('Email đã có người sử dụng!')
                }
            } else if (result.length === 2){
                error.push('Tên đăng nhập đã có người sử dụng!')
                error.push('Email đã có người sử dụng!')
            }
            res.render('register', {error})
        }
    })
}

function user(req, res) {
    const username = req.cookies.user
    const query = `select acc_username, acc_password, cus_email, cus_name, date_format(cus_dob, "%Y-%m-%d") as cus_dob, cus_address, cus_phone from customer, account where cus_email = acc_email and acc_username = "${username}"`
    connection.query(query, function (err, result) {
        res.render('user', {result})
    })
}

function userDetailsUpdate(req, res) {
    const user = req.cookies.user
    const name = req.body.name
    const dob = req.body.dob
    const address = req.body.address
    const phone = req.body.phone

    const query = `update customer, account set cus_name = "${name}", cus_dob = "${dob}", cus_address = "${address}", cus_phone = "${phone}" where cus_email = acc_email and acc_username = "${user}"`
    connection.query(query, function (err, result) {})
    res.redirect('/user')
}

function userPasswordUpdate(req, res) {
    const user = req.cookies.user
    const pass = req.body.newpass

    const query = `update account set acc_password = "${pass}" where acc_username = "${user}"`
    connection.query(query, function (err, result) {})
    res.redirect('/user')
}

function selectMovies(req, res) {
    const query = "select * from movie where mov_release <= now() order by mov_release desc"
    connection.query(query, function (err, result) {
        if (err) throw err;
        res.render('movies', {result})
    })
}

function selectComingSoon(req, res) {
    const query = "select * from movie where mov_release > now() order by mov_release desc"
    connection.query(query, function (err, result) {
        if (err) throw err;
        res.render('comingSoon', {result})
    })
}

function selectDetailsMovie(req, res) {
    const query = 'select mov_id, mov_name, date_format(mov_release, "%d-%m-%Y") as mov_release, mov_length, mov_description, mov_directors, mov_actors, mov_genres, mov_language, mov_age, mov_poster, mov_trailer from movie where mov_id = "' + req.params.slug + '"'
    connection.query(query, function (err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            if (result[i].mov_age == 1) {
                result[i].mov_age = 'Phim dành cho mọi đối tượng'
            } else {
                result[i].mov_age = 'Phim dành cho khán giả trên ' + result[i].mov_age + ' tuổi'
            }
        }
        res.render('detailsMovie', {result})
    })
}

function selectTrending(req, res) {
    const query = `select mov_id, mov_name, mov_length, mov_genres, mov_poster from ticket, movie, showtime where tic_showtime = sho_id and sho_movie = mov_id group by sho_movie order by count(tic_id) desc limit 2`
    connection.query(query, function (err, result) {
        if (err) throw err;
        res.render('home', {result})
    })
}

function selectShowtimes(req, res) {
    let query = ''
    if (req.query.movie) {
        query = 'select sho_id, date_format(sho_start, "%d-%m-%Y %H:%i") as date, sho_available, mov_name, bra_name, mov_poster from showtime, movie, room, branch where sho_movie = mov_id and sho_room = roo_id and roo_branch = bra_id and sho_movie = "' + req.query.movie + '" order by sho_start'
    } else if (req.query.branch) {
        query = 'select sho_id, date_format(sho_start, "%d-%m-%Y %H:%i") as date, sho_available, mov_name, bra_name, mov_poster from showtime, movie, room, branch where sho_movie = mov_id and sho_room = roo_id and roo_branch = bra_id and bra_id = "' + req.query.branch + '" order by sho_start'
    } else if (req.query.q) {
        query = 'select sho_id, date_format(sho_start, "%d-%m-%Y %H:%i") as date, sho_available, mov_name, bra_name, mov_poster from showtime, movie, room, branch where sho_movie = mov_id and sho_room = roo_id and roo_branch = bra_id and mov_name like "%' + req.query.q + '%" order by sho_start'
    } else {
        query = 'select sho_id, date_format(sho_start, "%d-%m-%Y %H:%i") as date, sho_available, mov_name, bra_name, mov_poster from showtime, movie, room, branch where sho_movie = mov_id and sho_room = roo_id and roo_branch = bra_id order by sho_start'
    }
    connection.query(query, function (err, result) {
        if (err) throw err;
        res.render('showtimes', {result})
    })
}

function renderSeats(req, res) {
    const id = req.query.id
    const query = 'select sho_id, sho_seats from showtime where sho_id = "' + id + '"'
    connection.query(query, function (err, result) {
        if (err) throw err
        const show_id = result[0].sho_id
        const show_seats = result[0].sho_seats.split(',')
        res.render('seats', {show_id, show_seats})
    })
}

function seatsHandler(req, res) {
    const username = req.cookies.user
    const id = req.body.id
    const seats = req.body.data.split(',')
    let query = ''
    seats.forEach(function (item) {
        query = `insert into ticket values ("${id}${item}", "${id}", "${item}", "${username}", 90000, now(), "Chua thanh toan")`
        connection.query(query, function (err, result) {})
        query = `insert into cart values ("${username}", "${id}${item}")`
        connection.query(query, function (err, result) {})
    })
    query = `select sho_available, sho_seats from showtime where sho_id = "${id}"`
    connection.query(query, function (err, result) {
        seats.forEach(function (item) {
            result[0].sho_seats = result[0].sho_seats.replace(item, '0')
        })
        newSho_available = result[0].sho_available - seats.length
        newSho_seats = result[0].sho_seats
        query = `update showtime set sho_available = ${newSho_available}, sho_seats = "${newSho_seats}" where sho_id = "${id}"`
        connection.query(query, function (err, result) {})
    })
    res.redirect('/tickets/cart')
}

function selectCart(req, res) {
    const username = req.cookies.user
    const query = `select tic_id, mov_name, bra_name, date_format(sho_start, "%d-%m-%Y %H:%i") as date, tic_seat, tic_price from ticket, showtime, room, movie, branch where tic_showtime = sho_id and sho_movie = mov_id and sho_room = roo_id and roo_branch = bra_id and tic_user = "${username}" and tic_status = "Chua thanh toan" order by sho_start, tic_seat`
    connection.query(query, function (err, result) {
        res.render('cart' , {result})
    })
}

function selectTickets(req, res) {
    const username = req.cookies.user
    const query = `select tic_id, mov_name, bra_name, date_format(sho_start, "%d-%m-%Y %H:%i") as sho_date, tic_seat, tic_price, date_format(tic_date, "%d-%m-%Y %H:%i") as tic_date, acc_email from ticket, showtime, room, movie, branch, customer, account where tic_showtime = sho_id and sho_movie = mov_id and sho_room = roo_id and roo_branch = bra_id and acc_username = tic_user and acc_email = cus_email and tic_user = "${username}" and tic_status = "Thanh toan" order by sho_start, tic_seat`
    connection.query(query, function (err, result) {
        res.render('tickets' , {result})
    })
}

function deleteCart(req, res) {
    const username = req.cookies.user
    const ticket = req.query.delete
    let query = `select sho_id, sho_available, sho_seats, tic_seat from showtime, ticket where sho_id = tic_showtime and tic_id = "${ticket}"`
    connection.query(query, function (err, result) {
        // Handler data of table showtime
        const valueChar = {'A' : -1, 'B' : 9, 'C' : 19, 'D' : 29, 'E' : 39, 'F' : 49, 'G' : 59, 'H' : 69, 'J' : 79, 'K' : 89}
        const sho_id = result[0].sho_id
        const sho_available = result[0].sho_available + 1
        const sho_seats = result[0].sho_seats.split(',')
        const tic_seat = result[0].tic_seat
        const row = result[0].tic_seat.slice(0,1)
        const col = parseInt(result[0].tic_seat.slice(1))
        sho_seats[valueChar[row] + col] = tic_seat
        const sho_seatsNew = sho_seats.join(',')


        query = `update showtime set sho_available = ${sho_available}, sho_seats = "${sho_seatsNew}" where sho_id = "${sho_id}"`
        connection.query(query, function (err, result) {})
        query = `delete from ticket where tic_id = "${ticket}" and tic_user = "${username}" and tic_status = "Chua thanh toan"`
        connection.query(query, function (err, result) {})
    })
    res.redirect('/tickets/cart')
}

function paymentTickets(req, res) {
    const username = req.cookies.user
    const query = `update ticket set tic_status = "Thanh toan" where tic_user = "${username}" and tic_status = "Chua thanh toan"`
    connection.query(query, function (err, result) {})
    res.redirect('/tickets')
}

module.exports = { 
    login,
    logout,
    register,
    user,
    userDetailsUpdate,
    userPasswordUpdate,
    selectMovies,
    selectComingSoon,
    selectDetailsMovie,
    selectTrending,
    selectShowtimes,
    renderSeats,
    seatsHandler,
    selectCart,
    deleteCart,
    selectTickets,
    paymentTickets, }
