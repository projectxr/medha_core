import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
function MyAppsArea() {
	const router = useRouter();
	return (
		<div className='bg-white bg-opacity-60 p-8 rounded-3xl h-[100%]'>
			<div className='flex flex-col mb-4'>
				<div className='text-lg font-bold'>My Apps</div>
				<div className='text-xs text-gray-500'>Explore the variety of useful apps</div>
			</div>
			<div className='bg-white p-4 rounded-2xl pb-16 w-fit'>
				<div className='grid grid-cols-4 gap-4 justify-center items-center'>
					{/* Placeholder for Create Quiz */}
					<div
						className='flex flex-col items-center space-y-1 action-button'
						onClick={() => router.push('/topicwiseform')}
					>
						<Image width={32} height={32} alt='' src='/Create_quiz.svg' className='w-16 h-16' />
						<div className='text-xs font-semibold text-center'>Create Quiz</div>
					</div>

					{/* Placeholder for Summarise PDF */}
					<div className='flex flex-col items-center space-y-1 action-button'>
						<Image
							width={32}
							height={32}
							alt=''
							src='/Summarize_pdf.svg'
							className='w-16 h-16'
							onClick={() => router.push('/summarize-pdf')}
						/>
						<div className='text-xs font-semibold text-center'>Summarise PDF</div>
					</div>

					{/* Placeholder for Create PPT */}
					<div className='flex flex-col items-center space-y-1 action-button'>
						<Image
							width={32}
							height={32}
							alt=''
							src='/Create_ppt.svg'
							className='w-16 h-16'
							onClick={() => router.push('/pptcreation/topic')}
						/>
						<div className='text-xs font-semibold text-center'>Create PPT</div>
					</div>

					{/* Placeholder for Summarise Youtube Video */}
					<div className='flex flex-col items-center space-y-1 action-button'>
						<Image width={32} height={32} alt='' src='/Summarize_yt.svg' className='w-16 h-16' />
						<div className='text-xs font-semibold text-center'>Summarise Youtube Video</div>
					</div>

					{/* Placeholder for Create Flash Cards */}
					<div className='flex flex-col items-center justify-center space-y-1 col-span-1 action-button'>
						<Image
							width={32}
							height={32}
							alt=''
							src='/create_exam_form.svg'
							className='w-16 h-16'
						/>
						<div className='text-xs font-semibold text-center'>Create Exam Form</div>
					</div>
					<div className='flex flex-col items-center space-y-1 action-button'>
						<Image
							width={32}
							height={32}
							alt=''
							src='/create_lesson_icon.svg'
							className='w-16 h-16'
							onClick={() => router.push('/createlesson')}
						/>
						<div className='text-xs font-semibold text-center'>Lesson Planner</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyAppsArea;
