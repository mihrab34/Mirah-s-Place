exports.index = async(req, res) => {
    res.render("page/index", {title: "Mirah's", currentPage: "Home" })
}
