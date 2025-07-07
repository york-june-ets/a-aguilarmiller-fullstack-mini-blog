import { useUser } from "@/contexts/userContext";
import { Blog } from "../../../types/types";

interface PostProps {
    blog: Blog; title: string; setTitle: React.Dispatch<React.SetStateAction<string>>; content: string; setContent: React.Dispatch<React.SetStateAction<string>>; setEditing: React.Dispatch<React.SetStateAction<boolean>>; setError: React.Dispatch<React.SetStateAction<string>>; error: string
}

export default function EditPost({ blog, title, setTitle, content, setContent, setEditing, setError, error }: PostProps) {
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
            <form onSubmit={handleEditSubmit} className='post'>
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