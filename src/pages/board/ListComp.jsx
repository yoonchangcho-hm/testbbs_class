import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

import dayjs from 'dayjs';

function ListComp() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const { data: posts } = await supabase.from('posts').select();

      console.log(posts);
      setPosts(posts);
    }

    getPosts();
  }, []);

  return (
    <div>
      <h3>post</h3>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            {post.title} / {post.name} / {post.content} /
            {dayjs(post.created_at).format('YYYY-MM-DD')}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ListComp;
