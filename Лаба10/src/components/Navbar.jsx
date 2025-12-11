import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/posts">Posts</Link></li>
                <li><Link to="/albums">Albums</Link></li>
                <li><Link to="/todos">Todos</Link></li>
                <li><Link to="/users">Users</Link></li>
            </ul>
        </nav>
    );
}
