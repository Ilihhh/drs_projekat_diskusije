from ..models.topic import Topic
from ..models.user import User
from ..database import db
from ..models.discussion import Discussion

class DiscussionService:
    @staticmethod
    def create_discussion(data, current_user):
        """Metoda za kreiranje nove diskusije"""

        title = data.get("title")
        text = data.get("text")
        topic_id = data.get("topic_id")

        if not title or not text or not topic_id:
            raise ValueError("Title, text, and topic_id are required.")

 
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found.")


        new_discussion = Discussion(
            title=title,
            text=text,
            topic_id=topic_id,
            author_id=current_user.id
        )

        try:

            db.session.add(new_discussion)
            db.session.commit()
            return new_discussion
        except Exception as e:
            db.session.rollback()
            raise ValueError(f"Error creating discussion: {str(e)}")

    @staticmethod
    def edit_discussion(data):

        if not data or 'id' not in data or 'title' not in data or 'text' not in data or 'topic_id' not in data:
            raise ValueError("Invalid input. 'id', 'title', 'text', and 'topic_id' are required.")
        
        discussion_id = data['id']
        title = data['title']
        text = data['text']
        topic_id = data['topic_id']


        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            raise ValueError("Discussion not found. 404")


        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found. 404")

    
        existing_discussion = Discussion.query.filter_by(title=title).filter(Discussion.id != discussion_id).first()
        if existing_discussion:
            raise ValueError("A discussion with this title already exists. 409")

        try:

            discussion.title = title
            discussion.text = text
            discussion.topic_id = topic_id  


            db.session.commit()
            return discussion

        except Exception as e:
      
            db.session.rollback()
            raise ValueError("An error occurred while updating the discussion. 500")
        
    @staticmethod
    def search_discussions(data):
  
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        address = data.get('address')
        email = data.get('email')
        name = data.get('name')  

        query = db.session.query(Discussion)

  
        if username:
            query = query.join(User).filter(User.username.ilike(f'%{username}%'))

        if first_name:
            query = query.filter(User.first_name.ilike(f'%{first_name}%'))
        if last_name:
            query = query.filter(User.last_name.ilike(f'%{last_name}%'))
        if address:
            query = query.filter(User.address.ilike(f'%{address}%'))
        if email:
            query = query.filter(User.email.ilike(f'%{email}%'))

     
        if name:
            query = query.join(Topic).filter(Topic.name.ilike(f'%{name}%'))

        
        discussions = query.all()

        return discussions

        