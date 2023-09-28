import React, { useEffect, useState } from 'react'

const UPDATE_BODY_RATE = 2000
const UPDATE_RUN_RATE = 100;

const STOP = false;

var runUpdate = 0;
var bodyUpdate = 0; 
var stepRun = 0;
var stepBody = 0;

export default function DinoTest({
    time
}: {
    time: number;
}) {    const body = require('../assets/dino_body_0.png');

    const headAA = require('../assets/dino_head_0.png');
    const headAB = require('../assets/dino_head_0b.png');
    const headAC = require('../assets/dino_head_0c.png');
    const headBA = require('../assets/dino_head_1.png');
    const headBB = require('../assets/dino_head_1b.png');
    const headBC = require('../assets/dino_head_1c.png');

    const handsA = require('../assets/dino_hands_0.png');
    const handsB = require('../assets/dino_hands_1.png');

    const tailA = require('../assets/dino_tail_0.png');
    const tailB = require('../assets/dino_tail_1.png');

    const legA = require('../assets/dino_leg_0.png');
    const legB = require('../assets/dino_leg_1.png');
    const legC = require('../assets/dino_leg_2.png');
    const legD = require('../assets/dino_leg_3.png');
    const legE = require('../assets/dino_leg_4.png');
    const legF = require('../assets/dino_leg_5.png');
    const legG = require('../assets/dino_leg_6.png');
    const legH = require('../assets/dino_leg_7.png');    


    const [headImage, setHeadImage] = useState(headBA);
    const [handsImage, setHandsImage] = useState(handsB);
    const [tailImage, setTailImage] = useState(tailA);

    const [legImageA, setLegImageA] = useState(legA);
    const [legImageB, setLegImageB] = useState(legF);

    useEffect(() => {
        if (STOP) {
            return;
        }
        if (bodyUpdate > UPDATE_BODY_RATE) {
            if (stepBody === 0) {
                setHeadImage(headAA);
            } else if (stepBody === 1) {
                setHeadImage(headAB);
            }
            stepBody = stepBody === 0 ? 1 : 0;
            setHandsImage(stepBody > 0 ? handsA : handsB);
            bodyUpdate = 0;
            return;
        }
        if (runUpdate > UPDATE_RUN_RATE) {
            let nextStep = stepRun + 1;
            switch (nextStep) {
                case 0:
                    setLegImageA(legA);
                    setLegImageB(legE);
                    break;
                case 1:
                    setLegImageA(legB);
                    setLegImageB(legF);
                    break;
                case 2:
                    setLegImageA(legC);
                    setLegImageB(legG);
                    break;
                case 3:
                    setLegImageA(legD);
                    setLegImageB(legH);
                    break;
                case 4:
                    setLegImageA(legE);
                    setLegImageB(legA);
                    nextStep = 0;
                    break;
            }
            stepRun = nextStep;
            runUpdate = 0;
            return;
        }
        runUpdate = runUpdate + time;  
        bodyUpdate = bodyUpdate + time;
    }, [time])

  return (
    <>
        {/* <h2>{stepBody} - {stepRun} - {runUpdate}</h2> */}
        <div style={styles.dinoMain}> 
            <img style={styles.dinoPart} src={body} alt='body' />
            <img style={styles.dinoPart} src={tailImage} alt='tail' />
            <img style={styles.dinoPart} src={headImage} alt='head' />
            <img style={styles.dinoPart} src={handsImage} alt='hands' />
            <img style={styles.dinoPart} src={legImageA} alt='leg' />
            <img style={styles.dinoPart} src={legImageB} alt='leg' />  
            <div style={styles.colliderBox}></div>
        </div> 
    </>
  )
}
// Define a type for your styles object
type Styles = {
    dinoMain: React.CSSProperties;
    dinoPart: React.CSSProperties;
    colliderBox: React.CSSProperties;
  };
  
const styles: Styles = {
    //All images inside dinoMain should be overlayed on top of each other.
    dinoMain: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    dinoPart: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    colliderBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 100,
        height: 50,
        backgroundColor: 'red',
        opacity: 0.5,
    },
}
