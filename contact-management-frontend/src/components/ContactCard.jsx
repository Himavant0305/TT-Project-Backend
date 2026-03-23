import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

export default function ContactCard({ contact, onDelete }) {
  return (
    <article className="contact-card">
      <div className="contact-card-head">
        <Avatar name={contact.name} size={48} />
        <div className="contact-card-body">
          <h3 className="contact-card-name">{contact.name}</h3>
          <p className="contact-card-meta">{contact.email}</p>
          <p className="contact-card-meta">{contact.phone}</p>
          {contact.address ? <p className="contact-card-meta">{contact.address}</p> : null}
        </div>
      </div>
      <div className="contact-card-actions">
        <Link to={`/contacts/${contact.id}/edit`} className="btn btn-accent btn-sm">
          Edit
        </Link>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(contact)}>
          Delete
        </button>
      </div>
    </article>
  );
}
