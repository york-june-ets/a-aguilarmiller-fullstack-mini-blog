import Link from "next/link";

export default function BlogList({ blogs }: any) {

    console.log(blogs)
    return (
        <div className="card-container">
            {blogs.map((blog: any, index: any) => (
                <div
                    key={blog.id}
                    className="card-item"
                    onMouseEnter={(e) => {
                        const card = e.currentTarget;
                        card.style.backgroundColor = '#fff';
                        card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        const card = e.currentTarget;
                        card.style.backgroundColor = '#d8c4b6';
                        card.style.boxShadow = 'none';
                    }}
                >
                    <img
                        src={PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}
                        alt={blog.title}
                        className="card-image"
                    />
                    <h2>{blog.title}</h2>
                    <p>Written: {blog.createdOn}</p>
                    <p>{blog.content}</p>
                    <Link href={`/blogs/${blog.id}`}>
                        <button className="button">Read More</button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    "https://img.freepik.com/premium-photo/sunset-beach-background-png-aesthetic-transparent-design_53876-1029940.jpg",
    "https://images.unsplash.com/photo-1530103043960-ef38714abb15?fm=jpg&q=60&w=3000",
    "https://i.pinimg.com/736x/5d/3a/b4/5d3ab4df7b9b3b33a620e39dc7a34d54.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIU8HVLEPnmmodwWzCVPhV6UvsaQpZFLErxw&s",
    "https://s.studiobinder.com/wp-content/uploads/2021/02/Natural-light-%E2%80%94-Aesthetic-pictures-of-people.jpg"
];