import { useUser } from "@/contexts/userContext";

interface PostProps {
    blog: any; title: any; setTitle: any; content: any; setContent: any; setEditing: any; setError: any; error: any
}

export default function Post({ blog, title, setTitle, content, setContent, setEditing, setError, error }: PostProps) {
    const { user } = useUser()

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/blogs/${blog.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, userId: user?.id }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error);
                return;
            }

            const updated = await res.json();
            setTitle(updated.title);
            setContent(updated.content);
            setEditing(false);
        } catch (err) {
            console.error(err);
            setError('Failed to update blog');
        }
    };

    return (
        <>
            <form onSubmit={handleEditSubmit} className='form'>
                <h2>Edit Post</h2>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='input'
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                />
                <div className='button-container'>
                    <button className='button' type="submit">Save</button>
                    <button className='button' type="button" onClick={() => setEditing(false)}>Cancel</button>
                </div>
                {error && <p className='error'>{error}</p>}
            </form>
        </>
    )
}