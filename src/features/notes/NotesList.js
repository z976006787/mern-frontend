import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"

const NotesList = () => {
    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery(undefined, {
        pollingInterval: 20000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const { isAdmin, isManager, username } = useAuth()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = notes

        let filtedIds

        if (isAdmin || isManager) {
            
            filtedIds = [...ids]

        }
        else {

            filtedIds = ids.filter((noteId) => {
               
                return entities[noteId].username === username

            })


        }


        const tableContent = filtedIds?.length
            ? filtedIds.map(noteId => <Note key={noteId} noteId={noteId} />)
            : null

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note__status">Status</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__title">Title</th>
                        <th scope="col" className="table__th note__username">Owner</th>
                        <th scope="col" className="table__th note__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default NotesList