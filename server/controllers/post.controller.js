// Mongoose scheme `Post` object
import Post from '../models/post';
import cuid from 'cuid';
import slug from 'slug'; // Library that creates a lowercase hyphen-ated string with no space
import sanitizeHtml from 'sanitize-html';

export function getPosts(req, res) {
  Post.find().sort('-dateAdded').exec((err, posts) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ posts });
  });
}

export function addPost(req, res) {
  if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
    return res.status(403).end();
  }

    /**
     * Gets a new mongoose `Post` object via the model scheme
     */
  const newPost = new Post(req.body.post);

  // Let's sanitize inputs
  newPost.title = sanitizeHtml(newPost.title);
  newPost.name = sanitizeHtml(newPost.name);
  newPost.content = sanitizeHtml(newPost.content);
  // This is unnecessary. Slug defaults to creating lowercase strings.
  newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
  newPost.cuid = cuid();
  newPost.save((err, saved) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ post: saved });
  });
}

export function getPost(req, res) {
  const newSlug = req.query.slug.split('-');
  const newCuid = newSlug[newSlug.length - 1];
  Post.findOne({ cuid: newCuid }).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ post });
  });
}

export function deletePost(req, res) {
  const postId = req.body.postId;
  Post.findById(postId).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }

    post.remove(() => {
      res.status(200).end();
    });
  });
}
