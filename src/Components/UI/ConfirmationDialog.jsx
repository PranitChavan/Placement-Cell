import { useConfirm } from 'material-ui-confirm';

export default function ConfirmationDialog() {
  const confirm = useConfirm();

  const confirmDeletion = () => {
    confirm({ description: 'Are you sure that you would like to delete this job post?', title: 'Delete Job Post' })
      .then(() => {
        deletePost(postId);
      })
      .catch(() => {});
  };

  return <></>;
}
