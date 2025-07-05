import { useUser } from "@/contexts/userContext";
import { useRouter } from "next/router";

interface CreatePostProps {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    error: string;
    setError: any;
    createPost: boolean;
    setCreatePost: (val: boolean) => void;
}

export default function CreatePost({ createPost, title, setTitle, content, setContent, setCreatePost, error, setError }: CreatePostProps) {
    const { user } = useUser();
    const router = useRouter();

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/blogs', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user?.id, title, content }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error || 'Failed to create post');
                return;
            }

            const newPost = await res.json();
            router.push(`/blogs/${newPost.id}`);

        } catch (err) {
            console.error(err);
            setError('Failed to create post');
        }
    };

    return (
        <>
            <form onSubmit={handleCreatePost} className={createPost ? 'visable' : 'hidden'}>
                <h2>Create Post</h2>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='input'
                    placeholder="Post title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="Write your content here..."
                />
                <div className='button-container'>
                    <button className="button" type="submit">Save</button>
                    <button
                        className='button'
                        type="button"
                        onClick={() => {
                            setCreatePost(false);
                            setTitle('');
                            setContent('');
                        }}
                    >
                        Cancel
                    </button>
                </div>
                {error && <p className='error'>{error}</p>}
            </form>
        </>
    )
}