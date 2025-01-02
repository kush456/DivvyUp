import GroupDetailsPage from "@/components/pages/Group/GroupDetails";


export default async function({ params }: { params: { groupId: string } }){

    const groupId = parseInt(params.groupId, 10);

    console.log(groupId);
    return(
        <GroupDetailsPage />
    )
}