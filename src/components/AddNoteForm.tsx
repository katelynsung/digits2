// 'use client';

// import { useSession } from 'next-auth/react';
// import { Button, Card, Col, Form, Row } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { redirect } from 'next/navigation';
// import { addNote } from '@/lib/dbActions';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import { AddNoteSchema } from '@/lib/validationSchemas';
// import { Contact } from '@prisma/client';

// const onSubmit = async (data: {
//   note: string;
//   owner: string;
//   contactId: number;
// }) => {
//   // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
//   await addNote(data);
//   swal('Success', 'Your Contact has been added', 'success', {
//     timer: 2000,
//   });
// };

// const AddNoteForm = ({ contact }: { contact: Contact }) => {
//   const { data: session, status } = useSession();
//   // console.log('AddStuffForm', status, session);
//   const currentUser = session?.user?.email || '';
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(AddNoteSchema),
//     // firstName: string;
//     // lastName: string;
//     // address: string;
//     // image: string;
//     // description: string;
//     // owner: string;
//     defaultValues: {
//       owner: currentUser,
//     },
//   });
//   if (status === 'loading') {
//     return <LoadingSpinner />;
//   }
//   if (status === 'unauthenticated') {
//     redirect('/auth/signin');
//   }

//   return (
//     <Card>
//       <Card.Header>Add Time Stamped Note</Card.Header>
//       <Card.Body>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           <Form.Group>
//             <Form.Label>Note</Form.Label>
//             <input
//               type="text"
//               {...register('note')}
//               className={`form-control ${errors.note ? 'is-invalid' : ''}`}
//             />
//             <div className="invalid-feedback">{errors.note?.message}</div>
//           </Form.Group>
//           <input type="hidden" {...register('owner')} value={currentUser} />
//           <input type="hidden" {...register('contactId')} value={contact.id} />
//           <Form.Group className="form-group">
//             <Row className="pt-3">
//               <Col>
//                 <Button type="submit" variant="primary">
//                   Submit
//                 </Button>
//               </Col>
//               <Col>
//                 <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
//                   Reset
//                 </Button>
//               </Col>
//             </Row>
//           </Form.Group>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// };

// export default AddNoteForm;

'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect } from 'next/navigation';
import { addNote } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddNoteSchema } from '@/lib/validationSchemas';
import { Contact } from '@prisma/client';
import swal from 'sweetalert';

const AddNoteForm = ({ contact }: { contact: Contact }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddNoteSchema),
    defaultValues: {
      owner: currentUser,
    },
  });

  const onSubmit = async (data: {
    note: string;
    owner: string;
    contactId: number;
  }) => {
    try {
      await addNote(data);
      swal('Success', 'Your Contact has been added', 'success', { timer: 2000 });
      reset();
    } catch (error) {
      console.error('Failed to add note:', error);
      swal('Error', 'Failed to add your contact', 'error');
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Card>
      <Card.Header>Add Time Stamped Note</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <input
              type="text"
              {...register('note')}
              className={`form-control ${errors.note ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.note?.message}</div>
          </Form.Group>
          <input type="hidden" {...register('owner')} value={currentUser} />
          <input type="hidden" {...register('contactId')} value={contact.id} />
          <Form.Group className="form-group">
            <Row className="pt-3">
              <Col>
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Col>
              <Col>
                <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddNoteForm;