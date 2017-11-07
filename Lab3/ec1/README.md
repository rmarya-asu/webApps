# ser421-Lab3

RUTHVIK ARYA - 1211286529
SHREYAS HOSAHALLI GOVINDARAJA - 1212953324


Please run npm install before you run
npm start

/landing -> home page
/login  -> Login Page
/signin ->  Logged in Page.
/list   ->  Book list Page
/purchase -> Credit card and other details
/confirm  -> Purchase successful confirm page

admin routes:
/admin/sigin ->sign in page for admin
name= admin password= admin
/Admin/signin -> Admin logged in successfully
/admin/manage -> Add a new book in admin page
/admin/addbook -> new book added confirmation page


username and password for administrator : 'admin'

Disclaimer: Since we did not use any DB, the books are stored in memory.
so, any new book added will only persist till the node server is running.
its a json list which is updated when a new book is added by the admin.
refresh page to see the change.

this also impacts the deleting of a newly added book by the admin.
