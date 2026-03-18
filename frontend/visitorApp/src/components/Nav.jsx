function Nav (){
    return (
        <>
            <nav className="flex justify-between text-white [&_a]:hover:font-bold [&_a]:transition-all text-4xl
            ">
                <h2><a href="/posts">Blog</a></h2>
                <div className="flex gap-3 ">
                    <a href="/signup">Sign up </a>
                    <a href="/login">Login </a>
                </div>
            </nav>
        </> 
    )
 }
 export default Nav