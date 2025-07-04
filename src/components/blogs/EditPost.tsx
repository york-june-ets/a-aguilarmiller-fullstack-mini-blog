import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/router';

interface EditPostProps {
    title: string;
    blog: any;
    content: any;
    setEditing: any;
    setError: any;
}

export default function EditPost({ title, blog, content, setEditing, setError }: EditPostProps) {
    const { user } = useUser()
    const router = useRouter();


    const handleDeleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/blogs/${blog.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error || 'Delete failed');
                return;
            }
            router.push('/blogs');

        } catch (err) {
            console.error(err);
            setError('Delete post failed');
        }
    };

    return (
        <div className='post'>
            <h1>{title}</h1>
            <p><em>by {blog.author}</em></p>
            <p>{content}</p>
            <div className='button-container'>
                <button className='button' onClick={() => router.push('/blogs')}>Return to blog page</button>
                {user?.id === blog.user_id && (
                    <>
                        <button onClick={() => setEditing(true)} className='button'>Edit Post</button>
                        <button className='button' onClick={handleDeleteSubmit}>Delete Post</button>
                    </>
                )}
            </div>
        </div>
    )
}